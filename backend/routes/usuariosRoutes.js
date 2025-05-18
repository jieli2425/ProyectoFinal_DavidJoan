const express = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

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

// Middleware de admin
const admin = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: 'Acceso solo para administradores' });
  next();
};

// Obtener perfil del usuario autenticado
router.get('/perfil', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.userId).select('-password');
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(usuario);
  } catch {
    res.status(500).json({ msg: 'Error al obtener perfil' });
  }
});

// Actualizar monedas (solo admin)
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

// Sumar monedas (solo para el usuario autenticado)
router.put('/:id/sumar-monedas', auth, async (req, res) => {
  const { id } = req.params;
  const { puntos } = req.body;

  // Verifica que el usuario autenticado sea el mismo que intenta modificar
  if (req.user.userId !== id) {
    return res.status(403).json({ msg: 'No tienes permiso para modificar este usuario' });
  }

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    usuario.monedas += puntos;
    await usuario.save();

    res.json({ msg: 'Monedas sumadas correctamente', monedas: usuario.monedas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al sumar monedas' });
  }
});

// Obtener todos los usuarios (solo admin)
router.get('/', auth, admin, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch {
    res.status(500).json({ msg: 'Error al obtener usuarios' });
  }
});

// Eliminar un usuario (solo admin)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json({ msg: 'Usuario eliminado' });
  } catch {
    res.status(500).json({ msg: 'Error al eliminar usuario' });
  }
});

// Hacer admin a un usuario (solo admin)
router.patch('/:id/make-admin', auth, admin, async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { isAdmin: true },
      { new: true }
    ).select('-password');

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({ msg: 'Usuario actualizado a administrador', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar usuario' });
  }
});

module.exports = router;
