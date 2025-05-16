const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const router = express.Router();

const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

router.post('/register', async (req, res) => {
  const { username, nombre, password, email, nie, fechaNacimiento, emailConfirm, passwordConfirm } = req.body;

  try {
    const existing = await Usuario.findOne({ username });
    if (existing) return res.status(400).json({ msg: 'Usuario ya existe' });

    if (email !== emailConfirm) {
      return res.status(400).json({ msg: 'Los emails no coinciden' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ msg: 'Las contraseñas no coinciden' });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const edad = calcularEdad(fechaNacimiento);
    if (edad < 18) {
      return res.status(400).json({ msg: 'Debes tener al menos 18 años' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Usuario({ username, nombre, password: hashedPassword, email, nie, fechaNacimiento });
    await user.save();

    res.status(201).json({ msg: 'Usuario registrado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Buscar usuario por email o username
    const identifier = email || username;
    const isEmail = identifier.includes('@');
    
    const user = await Usuario.findOne(isEmail ? { email: identifier } : { username: identifier });
    
    if (!user) {
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ 
      token,
      nombre: user.nombre,
      isAdmin: user.isAdmin,
      email: user.email,
      username: user.username,
      monedas: user.monedas
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

router.post('/verificar', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ msg: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Usuario.findById(decoded.userId)
      .select('isAdmin nombre email monedas'); // Seleccionamos solo los campos necesarios
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({ 
      isAdmin: user.isAdmin,
      userId: user._id,
      nombre: user.nombre,
      email: user.email,
      monedas: user.monedas
    });
  } catch (err) {
    console.error('Error en verificación:', err);
    res.status(401).json({ msg: 'Token inválido' });
  }
});

module.exports = router;