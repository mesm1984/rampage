const express = require('express');
const router = express.Router();

// Simule une base en mémoire (à remplacer par la BDD réelle)
let topics = [];
let messages = {};

// GET /api/forum/topics?category=...
router.get('/topics', (req, res) => {
  const { category } = req.query;
  if (!category) return res.status(400).json({ error: 'Catégorie requise' });
  const filtered = topics.filter(t => t.category === category);
  res.json(filtered);
});

// POST /api/forum/topics
router.post('/topics', (req, res) => {
  const { title, author, category } = req.body;
  if (!title || !author || !category) return res.status(400).json({ error: 'Champs manquants' });
  const now = new Date();
  const topic = {
    id: topics.length,
    title,
    author,
    replies: 0,
    lastReply: now.toLocaleString(),
    category
  };
  topics.push(topic);
  res.status(201).json(topic);
});

// GET /api/forum/messages/:topicId
router.get('/messages/:topicId', (req, res) => {
  const { topicId } = req.params;
  res.json(messages[topicId] || []);
});

// POST /api/forum/messages/:topicId
router.post('/messages/:topicId', (req, res) => {
  const { topicId } = req.params;
  const { utilisateur, contenu } = req.body;
  if (!utilisateur || !contenu) return res.status(400).json({ error: 'Champs manquants' });
  const msg = {
    utilisateur,
    contenu,
    timestamp: new Date().getTime()
  };
  if (!messages[topicId]) messages[topicId] = [];
  messages[topicId].push(msg);
  // Met à jour le topic
  if (topics[topicId]) {
    topics[topicId].replies = messages[topicId].length;
    topics[topicId].lastReply = new Date().toLocaleString();
  }
  res.status(201).json(msg);
});

module.exports = router;
