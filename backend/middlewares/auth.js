const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: 'No se proporcionó token de autenticación',
        code: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'El token ha expirado',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({ 
      message: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
}

function verificarAdmin(req, res, next) {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: 'No se proporcionó token de autenticación',
        code: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ 
        message: 'Acceso denegado. Se requiere rol de administrador',
        code: 'NOT_ADMIN'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'El token ha expirado',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({ 
      message: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
}

module.exports = { verificarToken, verificarAdmin };