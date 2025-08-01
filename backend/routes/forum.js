const express = require('express');
const router = express.Router();


const { ForumCategory, ForumTopic, ForumReply, User } = require('../models');

// GET /api/forum/topics?category=...

// Liste les sujets d'une catégorie
router.get('/topics', async (req, res) => {
  const { category } = req.query;
  if (!category) return res.status(400).json({ error: 'Catégorie requise' });
  try {
    // Cherche la catégorie
    const cat = await ForumCategory.findOne({ where: { name: category } });
    if (!cat) return res.json([]);
    const topics = await ForumTopic.findAll({
      where: { category_id: cat.id },
      order: [['created_at', 'DESC']]
    });
    res.json(topics);
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur', details: e.message });
  }
});

// POST /api/forum/topics

// Crée un nouveau sujet
router.post('/topics', async (req, res) => {
  const { title, author, category } = req.body;
  if (!title || !author || !category) return res.status(400).json({ error: 'Champs manquants' });
  try {
    // Cherche l'utilisateur
    const user = await User.findOne({ where: { username: author } });
    if (!user) return res.status(400).json({ error: 'Auteur inconnu' });
    // Cherche la catégorie
    let cat = await ForumCategory.findOne({ where: { name: category } });
    if (!cat) {
      cat = await ForumCategory.create({ name: category, slug: category.toLowerCase().replace(/ /g, '-') });
    }
    const topic = await ForumTopic.create({
      category_id: cat.id,
      user_id: user.id,
      title,
      slug: title.toLowerCase().replace(/ /g, '-'),
      content: '',
      created_at: new Date(),
      updated_at: new Date()
    });
    res.status(201).json(topic);
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur', details: e.message });
  }
});

// GET /api/forum/messages/:topicId

// Liste les messages d'un sujet
router.get('/messages/:topicId', async (req, res) => {
  const { topicId } = req.params;
  try {
    const replies = await ForumReply.findAll({
      where: { topic_id: topicId },
      order: [['created_at', 'ASC']]
    });
    res.json(replies);
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur', details: e.message });
  }
});

// POST /api/forum/messages/:topicId

// Ajoute un message à un sujet
router.post('/messages/:topicId', async (req, res) => {
  const { topicId } = req.params;
  const { utilisateur, contenu } = req.body;
  if (!utilisateur || !contenu) return res.status(400).json({ error: 'Champs manquants' });
  try {
    // Vérifie l'existence du sujet
    const topic = await ForumTopic.findByPk(topicId);
    if (!topic) return res.status(404).json({ error: 'Topic inexistant' });
    // Cherche l'utilisateur
    let user = await User.findOne({ where: { username: utilisateur } });
    if (!user) {
      // Si l'utilisateur n'existe pas, crée un utilisateur temporaire "Invité"
      user = await User.findOrCreate({
        where: { username: 'Invité' },
        defaults: {
          email: `invite_${Date.now()}@example.com`,
          password: 'invite',
          role: 'user',
          is_active: true
        }
      }).then(([u]) => u);
    }
    const reply = await ForumReply.create({
      topic_id: topicId,
      user_id: user.id,
      content: contenu,
      created_at: new Date(),
      updated_at: new Date()
    });
    res.status(201).json(reply);
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur', details: e.message });
  }
});

module.exports = router;
