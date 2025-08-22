
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./models');
const errorHandler = require('./middleware/error');

// Initialiser l'application Express
const app = express();

// Middleware
const path = require('path');
const authRoutes = require('./routes/auth');
const forumRoutes = require('./routes/forum');

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/forum', forumRoutes);

const dataPath = path.join(__dirname, '..', 'data');
const publicPath = path.join(__dirname, '..', 'public');
// Servir les fichiers statiques du dossier public

app.use(express.static(publicPath));
app.use('/data', express.static(path.join(__dirname, '../data')));
app.use('/data', express.static(dataPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.json')) {
      res.set('Content-Type', 'application/json');
    }
  }
}));

// Route de test pour vérifier l'accès au fichier faqs.json
app.get('/test-faqs', (req, res) => {
  const fs = require('fs');
  const faqPath = path.join(dataPath, 'faqs.json');
  if (fs.existsSync(faqPath)) {
    console.log('Fichier FAQs trouvé à:', faqPath);
    res.json({ 
      success: true, 
      message: 'Fichier FAQs trouvé',
      path: faqPath,
      exists: true
    });
    return;
  }
  console.error('Fichier FAQs non trouvé à:', faqPath);
  res.status(404).json({ 
    success: false, 
    message: 'Fichier FAQs non trouvé',
    path: faqPath,
    exists: false
  });
});

// Routes
// Route racine : servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});


// Route de test API
app.get('/api/test', (req, res) => {
  res.json({ message: 'API backend OK' });
});

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Forum API (mémoire, à remplacer par BDD)
app.use('/api/forum', forumRoutes);

// Gestion des erreurs
app.use(errorHandler);

// Gestion des routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée: ${req.originalUrl}`
  });
});

// Tester la connexion à la base de données
const connectDB = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connecté à la base de données MySQL');
    // Synchroniser les modèles avec la base de données
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

// Gestion des erreurs globales
process.on('unhandledRejection', (err) => {
  console.error('Rejet non géré:', err);
  // Fermer le serveur et arrêter le processus
  server.close(() => process.exit(1));
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
// Initialiser et synchroniser la base de données puis démarrer le serveur si pas en test
(async () => {
  const forceSync = process.env.NODE_ENV === 'test';
  await db.sequelize.sync({ force: forceSync });
  if (process.env.NODE_ENV !== 'test') {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
      console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
    });
  }
})();

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
  console.error('Erreur non capturée:', err);
  server.close(() => process.exit(1));
});

// Exporter également le serveur pour la fermeture dans les tests
// Exporter app et db pour les tests (serveur non démarré en test)
module.exports = { app, db };
