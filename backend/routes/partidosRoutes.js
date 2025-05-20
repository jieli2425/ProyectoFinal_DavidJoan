const express = require('express');
const jwt = require('jsonwebtoken');
const Partido = require('../models/Partido');
const Apuesta = require('../models/Apuesta');

const router = express.Router();

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

// Middleware para admin
const admin = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: 'Acceso solo para administradores' });
  next();
};

// router.post('/', auth, admin, async (req, res) => {
//   try {
//     const partido = new Partido(req.body);
//     await partido.save();
//     res.status(201).json(partido);
//   } catch {
//     res.status(500).json({ msg: 'Error al crear partido' });
//   }
// });

router.get('/', async (req, res) => {
  try {
    const { deporte, estado, fechaInicio, fechaFin, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (deporte) filter.deporte = deporte;
    if (estado) filter.estado = estado;
    if (fechaInicio || fechaFin) {
      filter.fecha = {};
      if (fechaInicio) filter.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) filter.fecha.$lte = new Date(fechaFin);
    }

    const partidos = await Partido.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(partidos);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener partidos' });
  }
});

router.patch('/:id/resultado', auth, admin, async (req, res) => {
  const { resultado } = req.body;
  try {
    const partido = await Partido.findByIdAndUpdate(req.params.id, {
      resultado,
      estado: 'finalizado'
    }, { new: true });
    if (!partido) return res.status(404).json({ msg: 'Partido no encontrado' });

    const apuestas = await Apuesta.find({ partidoId: partido._id });
    for (let ap of apuestas) {
      ap.ganadora = ap.eleccion === resultado;
      await ap.save();
    }

    res.json(partido);
  } catch {
    res.status(500).json({ msg: 'Error al actualizar resultado' });
  }
});

router.get('/premier-league', async (req, res) => {
  try {
    const partidos = await Partido.find({ competicion: 'Premier League' });
    res.json(partidos);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener partidos de la Premier League' });
  }
});

router.get('/champions-league', async (req, res) => {
  try {
    const partidos = await Partido.find({ competicion: 'UEFA Champions League' });
    res.json(partidos);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener partidos de la Champions League' });
  }
});
// GET /api/partidos/search?q=textoBusqueda
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ msg: 'Falta parámetro de búsqueda' });

  try {
    const regex = new RegExp(q, 'i'); // búsqueda case-insensitive
    const partidos = await Partido.find({
      $or: [
        { competicion: regex },
        { equipoLocal: regex },
        { equipoVisitante: regex }
      ],
      estado: 'pendiente'
    }).limit(10);

    res.json(partidos);
  } catch (err) {
    res.status(500).json({ msg: 'Error al buscar partidos' });
  }
});


module.exports = router;