const AuthHelpers = {};

AuthHelpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(403).json({
    status: 'AUTH_ERR',
    message: 'No autorizado',
  });
};

module.exports = AuthHelpers;
