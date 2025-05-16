const express = require('express');
const Apuesta = require('../models/Apuesta');
const Partido = require('../models/Partido');
const router = express.Router();
const { registrarApuesta, obtenerApuestas, resolverApuesta } = require('../controllers/apuestasController');
const { verificarToken } = require('../middlewares/auth');

// Ruta para registrar una nueva apuesta
router.post('/', verificarToken, registrarApuesta);

// Ruta para obtener las apuestas del usuario actual
router.get('/usuario', verificarToken, async (req, res) => {
  try {
    const apuestas = await Apuesta.find({ usuario: req.user.userId }).populate('partido');
    res.json(apuestas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener apuestas' });
  }
});

// Ruta para obtener el historial de apuestas
router.get('/historial', verificarToken, async (req, res) => {
  try {
    const apuestas = await Apuesta.find({ usuario: req.user.userId }).populate('partido');
    res.json(apuestas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial de apuestas' });
  }
});

// Ruta para obtener apuestas de un usuario específico
router.get('/usuario/:usuarioId', verificarToken, obtenerApuestas);

// Ruta para resolver una apuesta
router.put('/:apuestaId/resolver', verificarToken, resolverApuesta);

module.exports = router;