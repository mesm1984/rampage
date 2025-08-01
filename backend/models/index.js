const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

// Import des modèles

const User = require('./User')(sequelize, Sequelize);
const ForumCategory = require('./ForumCategory');
const ForumTopic = require('./ForumTopic');
const ForumReply = require('./ForumReply');

db.User = User;
db.ForumCategory = ForumCategory;
db.ForumTopic = ForumTopic;
db.ForumReply = ForumReply;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Associations entre les modèles (à ajouter plus tard si nécessaire)

module.exports = db;
