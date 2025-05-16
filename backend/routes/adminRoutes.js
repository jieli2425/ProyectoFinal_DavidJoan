const express = require('express');
const router = express.Router();
const { verificarToken, verificarAdmin } = require('../middlewares/auth');
const Usuario = require('../models/Usuario');
const Apuesta = require('../models/Apuesta');

// Obtener todos los usuarios
router.get('/usuarios', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
  }
});

// Obtener todas las apuestas
router.get('/apuestas', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const apuestas = await Apuesta.find()
      .populate('usuario', 'nombre email')
      .populate('partido', 'equipoLocal equipoVisitante');
    
    const apuestasFormateadas = apuestas.map(a => ({
      _id: a._id,
      usuarioNombre: a.usuario.nombre,
      equipoLocal: a.partido.equipoLocal.nombre,
      equipoVisitante: a.partido.equipoVisitante.nombre,
      resultadoApostado: a.eleccion,
      monedas: a.monedasApostadas,
      estado: a.resultado
    }));

    res.json(apuestasFormateadas);
  } catch (error) {
    console.error('Error al obtener apuestas:', error);
    res.status(500).json({ message: 'Error al obtener la lista de apuestas' });
  }
});

// Modificar monedas de un usuario
router.put('/usuarios/:userId/monedas', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { monedas } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.userId,
      { monedas },
      { new: true }
    );
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error('Error al modificar monedas:', error);
    res.status(500).json({ message: 'Error al modificar las monedas' });
  }
});

// Eliminar una apuesta
router.delete('/apuestas/:apuestaId', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const apuesta = await Apuesta.findByIdAndDelete(req.params.apuestaId);
    if (!apuesta) {
      return res.status(404).json({ message: 'Apuesta no encontrada' });
    }
    res.json({ message: 'Apuesta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar apuesta:', error);
    res.status(500).json({ message: 'Error al eliminar la apuesta' });
  }
});

module.exports = router;