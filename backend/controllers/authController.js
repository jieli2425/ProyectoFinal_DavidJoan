const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
};

const registrarUsuario = async (req, res) => {
  const { username, nombre, password, email, nie, fechaNacimiento, emailConfirm, passwordConfirm } = req.body;

  try {
    if (await Usuario.findOne({ username })) return res.status(400).json({ msg: 'Usuario ya existe' });
    if (email !== emailConfirm) return res.status(400).json({ msg: 'Los emails no coinciden' });
    if (password !== passwordConfirm) return res.status(400).json({ msg: 'Las contraseñas no coinciden' });
    if (password.length < 6) return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres' });

    const edad = calcularEdad(fechaNacimiento);
    if (edad < 18) return res.status(400).json({ msg: 'Debes tener al menos 18 años' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({ username, nombre, password: hashedPassword, email, nie, fechaNacimiento });
    await nuevoUsuario.save();

    return res.status(201).json({ msg: 'Usuario registrado' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = email || username;
    const isEmail = identifier.includes('@');
    const usuario = await Usuario.findOne(isEmail ? { email: identifier } : { username: identifier });

    if (!usuario) return res.status(400).json({ msg: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(400).json({ msg: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { userId: usuario._id, isAdmin: usuario.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      nombre: usuario.nombre,
      isAdmin: usuario.isAdmin,
      email: usuario.email,
      username: usuario.username,
      monedas: usuario.monedas
    });
  } catch (err) {
    console.error('Error en loginUsuario:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

const verificarToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ msg: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.userId).select('isAdmin nombre email monedas');
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

    res.json({
      isAdmin: usuario.isAdmin,
      userId: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      monedas: usuario.monedas
    });
  } catch (err) {
    console.error('Error en verificación:', err);
    res.status(401).json({ msg: 'Token inválido' });
  }
};

module.exports = { registrarUsuario, loginUsuario, verificarToken };