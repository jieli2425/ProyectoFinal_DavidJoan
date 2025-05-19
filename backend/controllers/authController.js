const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

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



const registrarUsuario = async (req, res) => {
  const { username, nombre, password, email, nie, fechaNacimiento, emailConfirm, passwordConfirm, isAdmin } = req.body;

  try {
    if (await Usuario.findOne({ username })) return res.status(400).json({ msg: 'Usuario ya existe' });
    if (email !== emailConfirm) return res.status(400).json({ msg: 'Los emails no coinciden' });
    if (password !== passwordConfirm) return res.status(400).json({ msg: 'Las contraseñas no coinciden' });
    if (password.length < 6) return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres' });

    const edad = calcularEdad(fechaNacimiento);
    if (edad < 18) return res.status(400).json({ msg: 'Debes tener al menos 18 años' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({ username, nombre, password: hashedPassword, email, nie, fechaNacimiento, isAdmin: !!isAdmin });
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
const solicitarResetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'Email requerido' });
  }

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ msg: 'No existe un usuario con ese email' });
    }

    const token = jwt.sign(
      { userId: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // token válido por 15 minutos
    );

    // Puedes enviar esto por email, pero tú lo enviarás al frontend para redirigir
    res.status(200).json({ token });

  } catch (error) {
    console.error('Error en solicitarResetPassword:', error);
    res.status(500).json({ msg: 'Error al solicitar restablecimiento' });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ msg: 'Faltan datos obligatorios' });
    }

    // Verificamos token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ msg: 'Token inválido o expirado' });
    }

    const usuario = await Usuario.findById(decoded.userId);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    usuario.password = hashedPassword;

    await usuario.save();

    res.status(200).json({ msg: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ msg: 'Error al restablecer la contraseña' });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  verificarToken,
  resetPassword,
  solicitarResetPassword
};
