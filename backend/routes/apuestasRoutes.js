const express = require('express');
const router = express.Router();
const { registrarApuesta, obtenerApuestas, resolverApuestasFinalizadas } = require('../controllers/apuestasController');
const { verificarToken } = require('../middlewares/auth');

// Registrar una nueva apuesta
router.post('/', verificarToken, registrarApuesta);

// Obtener apuestas del usuario logueado
router.get('/', verificarToken, obtenerApuestas);

// Obtener apuestas de un usuario específico (admin o autorización necesaria)
router.get('/usuario/:usuarioId', verificarToken, obtenerApuestas);

router.put('/resolver-finalizadas', verificarToken, resolverApuestasFinalizadas);

module.exports = router;