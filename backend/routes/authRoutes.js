const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario, verificarToken } = require('../controllers/authController');

// Rutas
router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/verificar', verificarToken);

module.exports = router;