const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ForumCategory = sequelize.define('ForumCategory', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT },
  slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'forum_categories',
  timestamps: false
});

module.exports = ForumCategory;
