const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Token requerido' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ msg: 'Token inválido' });
  }
};

const verificarAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ msg: 'Acceso solo para administradores' });
  next();
};

module.exports = { verificarToken, verificarAdmin };