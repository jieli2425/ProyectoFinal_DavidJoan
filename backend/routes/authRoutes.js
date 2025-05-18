const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario, verificarToken,solicitarResetPassword, resetPassword } = require('../controllers/authController');

// Rutas sin lógica, solo llaman a controller
router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/verificar', verificarToken);
router.post('/reset-password', resetPassword);
router.post('/solicitar-reset', solicitarResetPassword);

module.exports = router;
