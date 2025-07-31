require('dotenv').config({ path: '.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const fetch = require('node-fetch');

// Configuration initiale
const PORT = process.env.PORT || 3000; // Port par défaut 3000
// Suppression Hugging Face : plus de clé, modèle ou endpoint distant

// Création de l'application Express
console.log('=== Configuration du serveur ===');
console.log('Port:', PORT);
console.log('Environnement:', process.env.NODE_ENV || 'development');


console.log('\nCréation de l\'application Express...');
const app = express();

// Configuration du middleware
console.log('Configuration du middleware...');

// Configuration CORS plus sécurisée
const corsOptions = {
    origin: function (origin, callback) {
        // Autoriser toutes les origines en développement
        if (!origin || process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        // En production, autoriser uniquement les domaines spécifiés
        const allowedOrigins = [
            'https://votredomaine.com',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:5500',
            'http://127.0.0.1:5500'
        ];
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200 // Pour les navigateurs qui ne supportent pas 204
};

app.use(cors(corsOptions));

// Gestion des requêtes OPTIONS pour CORS preflight
app.options('*', cors(corsOptions));

// Middleware pour le parsing du JSON
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static('.'));

// Middleware pour ajouter des en-têtes de sécurité
app.use((req, res, next) => {
    // Protège contre les attaques XSS
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Empêche le chargement de la page dans une iframe
    res.setHeader('X-Frame-Options', 'DENY');
    // Active la politique de sécurité du contenu (CSP)
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com; img-src 'self' data:;");
    // Active le mode strict pour les cookies
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// Configuration des routes
console.log('Configuration des routes...');



// Charger les FAQs depuis le fichier JSON
let faqs = [];
try {
    console.log('Chargement du fichier FAQ...');
    const faqsData = require('./data/faqs.json');
    
    // Vérifier la structure des données
    if (!faqsData || !Array.isArray(faqsData.categories)) {
        throw new Error('Format de fichier FAQ invalide: categories manquantes');
    }
    
    // Extraire et aplatir toutes les questions
    faqs = faqsData.categories.flatMap(category => {
        if (!category.questions || !Array.isArray(category.questions)) {
            console.warn(`Catégorie sans questions: ${category.name || 'sans nom'}`);
            return [];
        }
        return category.questions.map(q => ({
            question: q.question,
            answer: q.reponse || q.answer, // Gérer les deux formats
            category: category.name
        }));
    });
    
    console.log(`${faqs.length} questions/réponses chargées depuis ${faqsData.categories.length} catégories`);
    
    // Afficher un échantillon pour vérification
    if (faqs.length > 0) {
        console.log('Exemple de question chargée:', {
            question: faqs[0].question.substring(0, 50) + '...',
            category: faqs[0].category
        });
    }
    
} catch (error) {
    console.error('Erreur lors du chargement des FAQs:', error.message);
    console.error('Stack:', error.stack);
}

// Fonction pour trouver une réponse dans les FAQs
function findInFAQs(question) {
    console.log('\n🔍 Recherche dans les FAQs pour:', question);
    
    if (!faqs || !faqs.length) {
        console.log('Aucune FAQ chargée ou tableau vide');
        return null;
    }
    
    const lowerQuestion = question.toLowerCase().trim();
    console.log('Question normalisée:', lowerQuestion);
    
    // 1. Vérifier les correspondances exactes
    const exactMatch = faqs.find(qa => {
        const qLower = qa.question.toLowerCase().trim();
        const match = qLower === lowerQuestion;
        if (match) console.log('Correspondance exacte trouvée:', qa.question);
        return match;
    });
    
    if (exactMatch) return exactMatch.answer;
    
    // 2. Vérifier si la question contient une question de la FAQ
    const partialMatch = faqs.find(qa => {
        const qLower = qa.question.toLowerCase();
        const match = lowerQuestion.includes(qLower) || qLower.includes(lowerQuestion);
        if (match) console.log('Correspondance partielle trouvée:', qa.question);
        return match;
    });
    
    if (partialMatch) return partialMatch.answer;
    
    // 3. Vérifier les mots-clés
    console.log('Recherche par mots-clés...');
    const keywords = lowerQuestion.split(/\s+/).filter(k => k.length > 2); // Ignorer les mots trop courts
    console.log('Mots-clés extraits:', keywords);
    
    const matches = [];
    
    for (const qa of faqs) {
        const qLower = qa.question.toLowerCase();
        const qaKeywords = qLower.split(/\s+/);
        
        const matchCount = keywords.filter(keyword => 
            qaKeywords.some(qaKw => qaKw.includes(keyword) || keyword.includes(qaKw))
        ).length;
        
        const matchRatio = matchCount / keywords.length;
        console.log(`Question: "${qa.question}" - Correspondance: ${matchCount}/${keywords.length} (${Math.round(matchRatio*100)}%)`);
        
        if (matchCount >= Math.min(2, keywords.length) || matchRatio > 0.5) {
            matches.push({ qa, score: matchCount });
        }
    }
    
    if (matches.length > 0) {
        // Trier par score décroissant
        matches.sort((a, b) => b.score - a.score);
        console.log('Meilleure correspondance trouvée:', matches[0].qa.question);
        return matches[0].qa.answer;
    }
    
    console.log('Aucune correspondance trouvée dans les FAQs');
    return null;
}

// Route pour récupérer les catégories de FAQ
app.get('/api/faqs', (req, res) => {
    try {
        const faqsData = require('./data/faqs.json');
        if (!faqsData || !Array.isArray(faqsData.categories)) {
            return res.status(500).json({ error: 'Format de fichier FAQ invalide' });
        }
        
        // Ne renvoyer que les informations nécessaires pour les catégories
        const categories = faqsData.categories.map(category => ({
            id: category.id,
            name: category.name,
            description: category.description || ''
        }));
        
        res.json({ categories });
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        res.status(500).json({ error: 'Erreur serveur lors du chargement des catégories' });
    }
});

// Route pour récupérer les questions d'une catégorie spécifique
app.get('/api/faqs/:categoryId', (req, res) => {
    try {
        const { categoryId } = req.params;
        const faqsData = require('./data/faqs.json');
        
        if (!faqsData || !Array.isArray(faqsData.categories)) {
            return res.status(500).json({ error: 'Format de fichier FAQ invalide' });
        }
        
        // Trouver la catégorie demandée
        const category = faqsData.categories.find(cat => cat.id === categoryId);
        
        if (!category) {
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        }
        
        // Renvoyer les questions de la catégorie
        res.json({
            id: category.id,
            name: category.name,
            description: category.description || '',
            questions: category.questions || []
        });
        
    } catch (error) {
        console.error('Erreur lors de la récupération des questions:', error);
        res.status(500).json({ error: 'Erreur serveur lors du chargement des questions' });
    }
});

// Route pour l'API de chat
app.post('/api/chat', async (req, res) => {
    console.log('\n=== NOUVELLE REQUÊTE API ===');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Corps de la requête:', JSON.stringify(req.body, null, 2));
    
    try {
        const { question, context = '' } = req.body;
        
        if (!question) {
            console.log('❌ Erreur: Aucune question fournie');
            return res.status(400).json({ error: 'La question est requise' });
        }

        console.log('Question reçue:', question);
        
        // Vérifier d'abord dans les FAQs
        console.log('\n🔍 Recherche dans les FAQs...');
        const faqAnswer = findInFAQs(question);
        if (faqAnswer) {
            console.log('✅ Réponse trouvée dans les FAQs');
            console.log('Question:', question);
            console.log('Réponse:', faqAnswer);
            return res.json([{ generated_text: faqAnswer }]);
        } else {
            console.log('ℹ️ Aucune correspondance dans les FAQs');
        }
        
        // Vérifier si c'est une question simple qui peut être gérée localement
        const simpleResponses = {
            'salut': 'Bonjour ! Comment puis-je vous aider avec le VTT Freeride aujourd\'hui ?',
            'bonjour': 'Bonjour ! Prêt pour une aventure en VTT ?',
            'au revoir': 'À bientôt ! N\'hésitez pas à revenir pour plus d\'infos sur le VTT !',
            'merci': 'Je vous en prie ! Avez-vous d\'autres questions sur le VTT ?',
            'aide': 'Je peux vous aider avec des questions sur le VTT, les compétitions, les techniques, etc. Posez-moi votre question !',
            'red bull rampage': 'Le Red Bull Rampage est une compétition de VTT de descente extrême qui se déroule dans le désert de l\'Utah.',
            'quand est le red bull rampage': 'Le Red Bull Rampage a généralement lieu en octobre. La date exacte pour 2025 sera annoncée prochainement.'
        };

        const lowerQuestion = question.toLowerCase();
        if (simpleResponses[lowerQuestion]) {
            console.log('Réponse simple trouvée');
            return res.json([{ generated_text: simpleResponses[lowerQuestion] }]);
        }
        

        // Si aucune réponse FAQ ou simple, réponse par défaut
        res.json([{ 
            generated_text: 'Je ne suis pas sûr de comprendre. Pourriez-vous reformuler votre question sur le VTT Freeride ?' 
        }]);
        
    } catch (error) {
        console.error('\n=== ERREUR DANS LA ROUTE /API/CHAT ===');
        console.error('Message d\'erreur:', error.message);
        console.error('Stack trace:', error.stack);
        
        // Journalisation plus détaillée pour le débogage
        if (error.response) {
            console.error('Réponse d\'erreur:', {
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data
            });
        }
        
        res.status(500).json({ 
            error: 'Désolé, une erreur est survenue lors du traitement de votre question.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Toutes les autres routes renvoient vers index.html
app.get('*', (req, res) => {
    console.log('Requête sur route non gérée:', req.path);
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Création du serveur HTTP
console.log('Création du serveur HTTP...');
const server = http.createServer(app);

// Gestion des erreurs du serveur
server.on('error', (error) => {
    console.error('Erreur du serveur:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`Le port ${PORT} est déjà utilisé`);
    }
    process.exit(1);
});

// Démarrer l'écoute
console.log('Démarrage de l\'écoute sur le port', PORT, '...');
server.listen(PORT, '0.0.0.0', () => {
    console.log('\n=== Serveur démarré avec succès ===');
    console.log(`URL: http://localhost:${PORT}`);
    console.log('Environnement:', process.env.NODE_ENV || 'development');

    console.log('\nAppuyez sur Ctrl+C pour arrêter le serveur\n');
    
    // Vérifier que le serveur est toujours en cours d'exécution
    setInterval(() => {
        console.log('[HEARTBEAT] Le serveur est toujours en cours d\'exécution...');
    }, 5000);
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
    console.log('\nArrêt du serveur...');
    server.close(() => {
        console.log('Serveur arrêté.');
        process.exit(0);
    });
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
    console.error('ERREUR NON GÉRÉE:', error);
    if (server && server.close) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('REJET NON GÉRÉ:', reason);    
    if (server && server.close) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});
