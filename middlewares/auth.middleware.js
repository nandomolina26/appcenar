const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect('/auth/login');
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) return next();
  const role = req.session.user.role;
  if (role === 'cliente') return res.redirect('/client/home');
  if (role === 'delivery') return res.redirect('/delivery/home');
  if (role === 'comercio') return res.redirect('/commerce/home');
  if (role === 'administrador') return res.redirect('/admin/home');
  res.redirect('/auth/login');
};

module.exports = { isAuthenticated, isNotAuthenticated };