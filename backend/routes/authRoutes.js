const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const router = express.Router();

// Registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await Usuario.findOne({ username });
    if (existing) return res.status(400).json({ msg: 'Usuario ya existe' });

    // Validación básica de la contraseña
    if (password.length < 6) {
      return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Usuario({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ msg: 'Usuario registrado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Usuario.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ msg: 'Contraseña incorrecta' });

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

module.exports = router;