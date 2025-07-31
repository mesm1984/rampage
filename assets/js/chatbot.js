/**
 * Chatbot pour Red Bull Rampage
 * Gère l'interface et la communication avec l'API du chatbot
 */
class ChatbotUI {
    constructor() {
        // Configuration
        this.config = {
            typingDelay: 300, // Délai de frappe simulé (ms)
            maxMessages: 100, // Nombre maximum de messages à conserver
            defaultGreeting: 'Bonjour ! Je suis votre assistant virtuel VTT. Posez-moi vos questions sur le VTT, le matériel, les techniques, etc.'
        };

        // Éléments DOM
        this.elements = {
            container: null,
            messages: null,
            input: null,
            sendButton: null,
            toggleButton: null,
            categoriesContainer: null
        };

        // État
        this.state = {
            isOpen: false,
            isTyping: false,
            categories: [],
            conversationId: this.generateConversationId()
        };

        // Initialisation
        this.initialize();
    }

    /**
     * Initialise le chatbot
     */
    initialize() {
        this.createUI();
        this.setupEventListeners();
        this.loadCategories();
        this.showGreeting();
    }

    /**
     * Crée l'interface utilisateur du chatbot
     */
    createUI() {
        // Créer le conteneur principal
        this.elements.container = document.createElement('div');
        this.elements.container.className = 'chatbot-container';
        this.elements.container.innerHTML = `
            <div class="chatbot-header">
                <h4>Assistant VTT</h4>
                <button class="chatbot-close">&times;</button>
            </div>
            <div class="chatbot-messages"></div>
            <div class="chatbot-categories">
                <div class="categories-title">Catégories :</div>
                <div class="categories-list"></div>
            </div>
            <div class="chatbot-input-container">
                <input type="text" class="chatbot-input" placeholder="Posez votre question...">
                <button class="chatbot-send">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                    </svg>
                </button>
            </div>
        `;

        // Ajouter le conteneur au corps du document
        document.body.appendChild(this.elements.container);

        // Mettre à jour les références des éléments
        this.elements.messages = this.elements.container.querySelector('.chatbot-messages');
        this.elements.input = this.elements.container.querySelector('.chatbot-input');
        this.elements.sendButton = this.elements.container.querySelector('.chatbot-send');
        this.elements.closeButton = this.elements.container.querySelector('.chatbot-close');
        this.elements.categoriesContainer = this.elements.container.querySelector('.categories-list');

        // Ajouter le bouton de bascule
        this.createToggleButton();
    }

    /**
     * Crée le bouton de bascule du chatbot
     */
    createToggleButton() {
        this.elements.toggleButton = document.createElement('button');
        this.elements.toggleButton.className = 'chatbot-toggle';
        this.elements.toggleButton.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 6h-3v2h3c.55 0 1 .45 1 1s-.45 1-1 1h-3v2h3c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1z"></path>
            </svg>
        `;
        document.body.appendChild(this.elements.toggleButton);
    }

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        // Envoyer un message avec le bouton
        this.elements.sendButton.addEventListener('click', () => this.handleSendMessage());
        
        // Envoyer un message avec Entrée
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        // Basculer le chat
        this.elements.toggleButton.addEventListener('click', () => this.toggleChat());
        this.elements.closeButton.addEventListener('click', () => this.toggleChat(false));

        // Fermer en cliquant en dehors
        document.addEventListener('click', (e) => {
            if (this.state.isOpen && 
                !this.elements.container.contains(e.target) && 
                !this.elements.toggleButton.contains(e.target)) {
                this.toggleChat(false);
            }
        });
    }

    /**
     * Charge les catégories depuis le fichier faqs.json
     */
    async loadCategories() {
        const faqUrl = window.location.origin + '/data/faqs.json';
        const testUrl = window.location.origin + '/test-faqs';
        
        console.log('Tentative de chargement des FAQs depuis:', faqUrl);
        console.log('URL de test du serveur:', testUrl);
        
        try {
            // D'abord, tester si le serveur est accessible
            const testResponse = await fetch(testUrl);
            console.log('Réponse du test serveur:', testResponse.status, testResponse.statusText);
            
            if (!testResponse.ok) {
                throw new Error(`Le serveur ne répond pas correctement: ${testResponse.status} ${testResponse.statusText}`);
            }
            
            const testData = await testResponse.json();
            console.log('Données de test du serveur:', testData);
            
            if (!testData.exists) {
                throw new Error('Le fichier FAQs n\'a pas été trouvé sur le serveur');
            }
            
            // Maintenant, charger les FAQs
            console.log('Chargement des FAQs depuis:', faqUrl);
            const response = await fetch(faqUrl, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            
            console.log('Réponse du chargement des FAQs:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erreur de réponse:', errorText);
                throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Données des FAQs chargées:', data ? 'Données reçues' : 'Aucune donnée');
            
            if (data && Array.isArray(data.categories)) {
                console.log(`Nombre de catégories chargées: ${data.categories.length}`);
                this.state.categories = data.categories;
                this.renderCategories();
            } else {
                throw new Error('Format de données invalide: le fichier ne contient pas de catégories');
            }
        } catch (error) {
            console.error('Erreur détaillée lors du chargement des FAQs:', error);
            
            // Message d'erreur plus détaillé pour l'utilisateur
            let errorMessage = 'Désolé, je n\'ai pas pu charger les questions fréquentes. ';
            
            if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Impossible de se connecter au serveur. ';
                errorMessage += 'Veuillez vérifier votre connexion et réessayer.';
            } else if (error.message.includes('404')) {
                errorMessage += 'Le fichier des questions n\'a pas été trouvé. ';
                errorMessage += 'Veuillez contacter l\'administrateur du site.';
            } else {
                errorMessage += `Erreur: ${error.message}`;
            }
            
            this.addMessage(errorMessage, 'bot error');
            
            // Pour le débogage, afficher les informations de l'erreur
            console.log('État actuel du chatbot:', {
                categories: this.state.categories,
                error: error.toString(),
                stack: error.stack
            });
            
            // Essayer de charger des données de démonstration en cas d'échec
            this.loadFallbackCategories();
        }
    }

    /**
     * Affiche les catégories dans l'interface
     */
    renderCategories() {
        if (!this.state.categories.length) {
            this.addMessage('Aucune catégorie disponible pour le moment.', 'bot');
            return;
        }

        // Créer un conteneur pour les boutons de catégorie
        const categoriesContainer = document.createElement('div');
        categoriesContainer.className = 'categories-buttons';
        
        // Ajouter chaque catégorie comme un bouton cliquable
        this.state.categories.forEach(category => {
            if (category.name && category.id) {
                const button = document.createElement('button');
                button.className = 'category-tag';
                button.textContent = category.name;
                button.onclick = () => this.handleCategorySelect(category.id);
                categoriesContainer.appendChild(button);
            }
        });
        
        // Créer un conteneur de message pour les catégories
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message bot';
        messageDiv.appendChild(document.createTextNode('Choisissez une catégorie :'));
        messageDiv.appendChild(document.createElement('br'));
        messageDiv.appendChild(categoriesContainer);
        
        // Ajouter le message à la conversation
        this.elements.messages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Gère la sélection d'une catégorie
     */
    handleCategorySelect(categoryId) {
        const category = this.state.categories.find(cat => cat.id === categoryId);
        if (category && category.questions) {
            // Afficher les questions de la catégorie
            this.addMessage(`Voici les questions disponibles pour ${category.name} :`, 'bot');
            
            // Ajouter un délai pour l'affichage progressif
            category.questions.forEach((question, index) => {
                setTimeout(() => {
                    const questionBtn = document.createElement('button');
                    questionBtn.className = 'question-btn';
                    questionBtn.textContent = question.question;
                    questionBtn.onclick = () => this.handleQuestionSelect(question);
                    
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'chatbot-message bot';
                    messageDiv.appendChild(questionBtn);
                    
                    this.elements.messages.appendChild(messageDiv);
                    this.scrollToBottom();
                }, 100 * (index + 1));
            });
        }
    }
    
    /**
     * Gère la sélection d'une question
     */
    handleQuestionSelect(question) {
        // Afficher la question de l'utilisateur
        this.addMessage(question.question, 'user');
        
        // Afficher la réponse avec un léger délai
        setTimeout(() => {
            this.addMessage(question.reponse, 'bot');
        }, 500);
    }

    /**
     * Gère l'envoi d'un message
     */
    handleSendMessage() {
        const message = this.elements.input.value.trim();
        if (!message) return;

        // Ajouter le message de l'utilisateur
        this.addMessage(message, 'user');
        this.elements.input.value = '';

        // Afficher l'indicateur de frappe
        this.showTypingIndicator();

        // Vérifier si le message correspond à une question connue
        const matchedQuestion = this.findMatchingQuestion(message);
        
        if (matchedQuestion) {
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage(matchedQuestion.reponse, 'bot');
            }, 800);
        } else {
            // Si aucune correspondance trouvée, afficher un message par défaut
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage('Je ne suis pas sûr de comprendre votre question. Voici les catégories disponibles :', 'bot');
                this.renderCategories();
            }, 800);
        }
    }

    /**
     * Trouve une question correspondante dans les FAQs
     */
    findMatchingQuestion(message) {
        const normalizedMessage = message.toLowerCase().trim();
        
        for (const category of this.state.categories) {
            if (category.questions) {
                for (const question of category.questions) {
                    if (question.question.toLowerCase().includes(normalizedMessage) || 
                        normalizedMessage.includes(question.question.toLowerCase())) {
                        return question;
                    }
                }
            }
        }
        return null;
    }

    /**
     * Envoie un message au chatbot
     */
    async sendToChatbot(message) {
        // Cette méthode est conservée pour la compatibilité
        // La logique de réponse est maintenant gérée dans handleSendMessage
        this.hideTypingIndicator();
        
        // Vérifier si le message correspond à une question connue
        const matchedQuestion = this.findMatchingQuestion(message);
        
        if (matchedQuestion) {
            this.addMessage(matchedQuestion.reponse, 'bot');
        } else {
            this.addMessage('Je ne suis pas sûr de comprendre votre question. Voici les catégories disponibles :', 'bot');
            this.renderCategories();
        }
    }

    /**
     * Affiche le message de bienvenue
     */
    showGreeting() {
        setTimeout(() => {
            this.addMessage(this.config.defaultGreeting, 'bot');
        }, 1000);
    }

    /**
     * Ajoute un message à la conversation
     */
    addMessage(text, type = 'user') {
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${type}`;
        
        // Formater le texte pour afficher les sauts de ligne
        const formattedText = text.replace(/\n/g, '<br>');
        
        messageElement.innerHTML = `
            <div class="message-content">${formattedText}</div>
            <div class="message-time">${this.getCurrentTime()}</div>
        `;
        
        this.elements.messages.appendChild(messageElement);
        this.scrollToBottom();
        
        // Limiter le nombre de messages
        this.limitMessages();
    }

    /**
     * Affiche l'indicateur de frappe
     */
    showTypingIndicator() {
        if (this.state.isTyping) return;
        
        this.state.isTyping = true;
        const indicator = document.createElement('div');
        indicator.className = 'chatbot-message bot typing';
        indicator.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        this.elements.messages.appendChild(indicator);
        this.scrollToBottom();
    }

    /**
     * Masque l'indicateur de frappe
     */
    hideTypingIndicator() {
        this.state.isTyping = false;
        const indicator = this.elements.messages.querySelector('.typing');
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Bascule l'affichage du chat
     */
    toggleChat(show = null) {
        this.state.isOpen = show !== null ? show : !this.state.isOpen;
        
        if (this.state.isOpen) {
            this.elements.container.classList.add('active');
            this.elements.toggleButton.classList.add('active');
            this.elements.input.focus();
        } else {
            this.elements.container.classList.remove('active');
            this.elements.toggleButton.classList.remove('active');
        }
    }

    /**
     * Fait défiler la conversation vers le bas
     */
    scrollToBottom() {
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }

    /**
     * Limite le nombre de messages affichés
     */
    limitMessages() {
        const messages = this.elements.messages.querySelectorAll('.chatbot-message');
        if (messages.length > this.config.maxMessages) {
            const messagesToRemove = messages.length - this.config.maxMessages;
            for (let i = 0; i < messagesToRemove; i++) {
                messages[i].remove();
            }
        }
    }

    /**
     * Charge des catégories d'exemple en cas d'échec
     */
    loadFallbackCategories() {
        console.log('Chargement des catégories d\'exemple...');
        
        // Données d'exemple
        const fallbackData = {
            categories: [
                {
                    id: 'nutrition',
                    name: 'Nutrition et Hydratation',
                    questions: [
                        {
                            question: 'Que manger avant une sortie VTT ?',
                            reponse: 'Avant une sortie VTT, privilégiez les glucides complexes (pâtes complètes, riz, flocons d\'avoine) 2-3 heures avant le départ. Ajoutez des protéines maigres et évitez les aliments gras ou trop riches en fibres qui pourraient causer des problèmes digestifs pendant l\'effort.',
                            category: 'Nutrition et Hydratation'
                        },
                        {
                            question: 'Comment bien s\'hydrater à VTT ?',
                            reponse: 'Buvez régulièrement par petites gorgées, environ toutes les 15-20 minutes, même si vous n\'avez pas soif. Prévoyez 500ml à 1L d\'eau par heure d\'effort selon la température. Pour les sorties de plus d\'une heure, utilisez une boisson isotonique pour compenser les pertes en sels minéraux.',
                            category: 'Nutrition et Hydratation'
                        }
                    ]
                },
                {
                    id: 'technique',
                    name: 'Techniques de Pilotage',
                    questions: [
                        {
                            question: 'Comment bien négocier les virages en VTT ?',
                            reponse: 'Pour bien négocier un virage en VTT :\n1. Freinez avant le virage\n2. Regardez loin devant vers la sortie du virage\n3. Mettez-vous en position de base (pédales à l\'horizontale, coudes et genoux fléchis)\n4. Poussez sur le cintre à l\'extérieur du virage\n5. Redressez la trajectoire en sortie de virage en accélérant progressivement',
                            category: 'Techniques de Pilotage'
                        }
                    ]
                },
                {
                    id: 'materiel',
                    name: 'Matériel et Entretien',
                    questions: [
                        {
                            question: 'Comment entretenir ma chaîne de VTT ?',
                            reponse: 'Pour un bon entretien de votre chaîne :\n1. Nettoyez-la régulièrement avec un dégraissant spécifique\n2. Séchez-la soigneusement\n3. Appliquez un lubrifiant adapté à vos conditions de roulage (sec ou humide)\n4. Essuyez l\'excédent de lubrifiant\n5. Vérifiez son usure avec un testeur de chaîne (à remplacer généralement à 0.75% d\'usure)',
                            category: 'Matériel et Entretien'
                        }
                    ]
                }
            ]
        };
        
        this.state.categories = fallbackData.categories;
        console.log('Catégories d\'exemple chargées:', this.state.categories);
        this.renderCategories();
        
        // Afficher un message à l'utilisateur
        this.addMessage('Mode démo activé : voici des exemples de questions fréquentes.', 'bot');
    }

    /**
     * Génère un ID de conversation unique
     */
    generateConversationId() {
        return 'conv_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Retourne l'heure actuelle formatée
     */
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

// Initialiser le chatbot lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new ChatbotUI();
});
