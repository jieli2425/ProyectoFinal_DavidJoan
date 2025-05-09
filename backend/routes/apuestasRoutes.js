const express = require('express');
const jwt = require('jsonwebtoken');
const Apuesta = require('../models/Apuesta');
const Partido = require('../models/Partido');
const router = express.Router();

// Middleware de autenticación
const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Token requerido' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ msg: 'Token inválido' });
  }
};

router.post('/', auth, async (req, res) => {
  const { partidoId, eleccion } = req.body;
  try {
    // Verificar si el partido existe
    const partido = await Partido.findById(partidoId);
    if (!partido) return res.status(400).json({ msg: 'Partido no encontrado' });

    const existente = await Apuesta.findOne({ usuario: req.user.userId, partidoId });
    if (existente) return res.status(400).json({ msg: 'Ya apostaste en este partido' });

    const apuesta = new Apuesta({
      usuario: req.user.userId,
      partidoId,
      eleccion
    });
    await apuesta.save();
    res.status(201).json({ msg: 'Apuesta guardada' });
  } catch {
    res.status(500).json({ msg: 'Error al guardar apuesta' });
  }
});

router.get('/usuario', auth, async (req, res) => {
  try {
    const apuestas = await Apuesta.find({ usuario: req.user.userId }).populate('partidoId');
    res.json(apuestas);
  } catch {
    res.status(500).json({ msg: 'Error al obtener apuestas' });
  }
});

router.get('/historial', auth, async (req, res) => {
  try {
    const apuestas = await Apuesta.find({ usuario: req.user.userId }).populate('partidoId');
    res.json(apuestas);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener historial de apuestas' });
  }
});

module.exports = router;