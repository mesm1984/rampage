const bcrypt = require('bcrypt');
const { User } = require('../models');

// Inscription utilisateur
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }
    // Vérifier si l'email existe déjà
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    // Création de l'utilisateur
    await User.create({
      username,
      email,
      password: hashedPassword
    });
    res.status(201).json({ message: 'Inscription réussie.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});
const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const router = express.Router();

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Vérification des champs
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }
    // Vérifier si l'email existe déjà
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    // Création de l'utilisateur
    await User.create({
      username,
      email,
      password: hashedPassword
    });
    res.status(201).json({ message: 'Inscription réussie.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
