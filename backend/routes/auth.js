const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

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

// Connexion utilisateur
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }
    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }
    // Créer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    // Envoyer la réponse
    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Déconnexion utilisateur
// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Déconnexion réussie.' });
});

module.exports = router;
