// Gestionnaire d'erreurs global
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur pour le développement
  console.error(err.stack);

  // Erreur de validation Mongoose
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const message = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: message,
    });
  }

  // Erreur de clé étrangère
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = 'Erreur de référence : ' + err.message;
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // Erreur JWT invalide
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token invalide';
    return res.status(401).json({
      success: false,
      message,
    });
  }

  // Erreur JWT expiré
  if (err.name === 'TokenExpiredError') {
    const message = 'La session a expiré, veuillez vous reconnecter';
    return res.status(401).json({
      success: false,
      message,
    });
  }

  // Erreur par défaut
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erreur serveur',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = errorHandler;
