const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Configuration de la connexion à la base de données
const sequelize = new Sequelize(
  process.env.DB_NAME || 'redbull_db',
  process.env.DB_USER || 'redbull_user',
  process.env.DB_PASS || 'redbull_password',
  {
    host: process.env.DB_HOST || 'db',
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// Tester la connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
    // Ne pas quitter le processus ici, laisser le serveur gérer la reconnexion
  }
};

// Exécuter le test de connexion
testConnection();

module.exports = sequelize;
