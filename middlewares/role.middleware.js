const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session.user) return res.redirect('/auth/login');
    if (roles.includes(req.session.user.role)) return next();
    res.status(403).render('auth/login', {
      error: 'No tienes permiso para acceder a esta página.'
    });
  };
};

module.exports = { hasRole };