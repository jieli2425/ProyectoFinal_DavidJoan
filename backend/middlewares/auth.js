const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Error en verificación de token:', error);
    return res.status(401).json({ message: 'Error en la autenticación' });
  }
}

function verificarAdmin(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
      }

      if (!decoded.isAdmin) {
        return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador' });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Error en verificación de admin:', error);
    return res.status(401).json({ message: 'Error en la autenticación' });
  }
}

module.exports = { verificarToken, verificarAdmin };