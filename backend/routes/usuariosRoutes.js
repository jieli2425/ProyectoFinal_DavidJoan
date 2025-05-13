const express = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

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

const admin = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: 'Acceso solo para administradores' });
  next();
};

router.get('/perfil', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.userId).select('-password');
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(usuario);
  } catch {
    res.status(500).json({ msg: 'Error al obtener perfil' });
  }
});

router.patch('/:id/monedas', auth, admin, async (req, res) => {
  const { monedas } = req.body;
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, { monedas }, { new: true }).select('-password');
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(usuario);
  } catch {
    res.status(500).json({ msg: 'Error al actualizar monedas' });
  }
});

router.get('/', auth, admin, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch {
    res.status(500).json({ msg: 'Error al obtener usuarios' });
  }
});

router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json({ msg: 'Usuario eliminado' });
  } catch {
    res.status(500).json({ msg: 'Error al eliminar usuario' });
  }
});

module.exports = router;