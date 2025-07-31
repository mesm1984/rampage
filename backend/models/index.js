const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

// Import des modèles
const User = require('./User')(sequelize, Sequelize);

// Ajout des modèles à l'objet db
db.User = User;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Associations entre les modèles (à ajouter plus tard si nécessaire)

module.exports = db;
