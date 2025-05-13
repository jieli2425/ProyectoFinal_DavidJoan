const Usuario = require('../models/Usuario');
const Apuesta = require('../models/Apuesta');

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: 'Error al listar usuarios', error: err });
  }
};

const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await usuario.deleteOne();

    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};

const modificarMonedas = async (req, res) => {
  const { usuarioId, nuevasMonedas } = req.body;
  try {
    await Usuario.findByIdAndUpdate(usuarioId, { monedas: nuevasMonedas });
    res.json({ message: 'Monedas actualizadas correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al modificar monedas', error: err });
  }
};

const listarApuestas = async (req, res) => {
    try {
      const apuestas = await Apuesta.find()
        .populate('usuario', 'nombre email')
        .populate('partido');
  
      res.status(200).json(apuestas);
    } catch (error) {
      res.status(500).json({ message: 'Error al listar las apuestas', error });
    }
  };

module.exports = { listarUsuarios, eliminarUsuario, modificarMonedas, listarApuestas };