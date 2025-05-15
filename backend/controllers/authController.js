const Usuario = require('../model/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({ nombre, email, password: passwordEncriptada, monedas: 250 });
    await nuevoUsuario.save();

    const token = jwt.sign(
      { userId: nuevoUsuario._id, role: nuevoUsuario.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      token,
      nombre: nuevoUsuario.nombre
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const esCorrecta = await bcrypt.compare(password, usuario.password);
    if (!esCorrecta) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    console.log('Usuario encontrado:', {
      id: usuario._id,
      nombre: usuario.nombre,
      isAdmin: usuario.isAdmin
    });

    const token = jwt.sign(
      { 
        userId: usuario._id,
        nombre: usuario.nombre,
        isAdmin: usuario.isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      token,
      nombre: usuario.nombre,
      isAdmin: usuario.isAdmin,
      userId: usuario._id,
      monedas: usuario.monedas
    });
  } catch (error) {
    console.error('Error en loginUsuario:', error);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

const verificarToken = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.userId);
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    return res.status(200).json({ 
      userId: decoded.userId, 
      isAdmin: usuario.isAdmin 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al verificar el token' });
  }
};

module.exports = { registrarUsuario, loginUsuario, verificarToken };
