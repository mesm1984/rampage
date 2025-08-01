const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ForumReply = sequelize.define('ForumReply', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  topic_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  is_solution: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'forum_replies',
  timestamps: false
});

module.exports = ForumReply;
