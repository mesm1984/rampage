const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware pour protéger les routes
 * Vérifie la présence et la validité du token JWT
 */
exports.protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est présent dans les en-têtes
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extraire le token du format "Bearer token"
    token = req.headers.authorization.split(' ')[1];
  } 
  // Vérifier si le token est présent dans les cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé - Aucun token fourni',
    });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur depuis la base de données
    const user = await User.findByPk(decoded.id);
    
    // Vérifier que l'utilisateur existe
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Le token est valide mais l\'utilisateur n\'existe plus',
      });
    }
    
    // Ajouter l'utilisateur à l'objet request
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    
    // Message d'erreur plus détaillé selon le type d'erreur
    let errorMessage = 'Session invalide ou expirée';
    
    if (error.name === 'TokenExpiredError') {
      errorMessage = 'Session expirée - Veuillez vous reconnecter';
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Token invalide';
    }
    
    return res.status(401).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Middleware pour autoriser certains rôles
 * @param {...string} roles - Les rôles autorisés
 * @returns {Function} Middleware Express
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Vérifier si l'utilisateur est connecté
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé - Utilisateur non authentifié',
      });
    }
    
    // Vérifier si l'utilisateur a un des rôles requis
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé - Le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource`,
      });
    }
    
    next();
  };
};
