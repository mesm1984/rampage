const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ForumTopic = sequelize.define('ForumTopic', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  slug: { type: DataTypes.STRING(255), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  is_pinned: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_locked: { type: DataTypes.BOOLEAN, defaultValue: false },
  view_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'forum_topics',
  timestamps: false
});

module.exports = ForumTopic;
