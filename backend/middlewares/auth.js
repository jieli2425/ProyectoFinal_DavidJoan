const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    req.user = decoded;
    next();
  });
}

function verificarAdmin(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
    }

    req.user = decoded;
    next();
  });
}

module.exports = { verificarToken, verificarAdmin };