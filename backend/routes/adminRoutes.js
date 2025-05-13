const express = require('express');
const router = express.Router();
const Partidos = require('../models/Partido');
const { verificarAdmin } = require('../middlewares/auth');

router.use(verificarAdmin);

router.post('/partidos', async (req, res) => {
  try {
    const { equipoLocal, equipoVisitante, fecha } = req.body;
    const partido = new Partidos({ equipoLocal, equipoVisitante, fecha });
    await partido.save();
    res.status(201).json(partido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creando el partido' });
  }
});

router.delete('/partidos/:id', async (req, res) => {
  try {
    const partido = await Partidos.findByIdAndDelete(req.params.id);
    if (!partido) return res.status(404).json({ message: 'Partido no encontrado' });
    res.status(200).json({ message: 'Partido eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando el partido' });
  }
});

module.exports = router;