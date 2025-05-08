const Apuesta = require('../model/Apuesta');
const Partido = require('../model/Partido');
const Usuario = require('../model/Usuario');

const registrarApuesta = async (req, res) => {
  try {
    const { userId, partidoId, apuesta } = req.body;

    const partido = await Partido.findById(partidoId);
    if (!partido) {
      return res.status(404).json({ message: 'Partido no encontrado' });
    }

    const apuestaExistente = await Apuesta.findOne({ userId, partidoId });
    if (apuestaExistente) {
      return res.status(400).json({ message: 'Ya has apostado en este partido' });
    }

    const nuevaApuesta = new Apuesta({ userId, partidoId, apuesta });
    await nuevaApuesta.save();

    return res.status(201).json(nuevaApuesta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al registrar la apuesta' });
  }
};

// Obtener todas las apuestas de un usuario
const obtenerApuestas = async (req, res) => {
  try {
    const { userId } = req.params;
    const apuestas = await Apuesta.find({ userId }).populate('partidoId');

    if (!apuestas) {
      return res.status(404).json({ message: 'No se encontraron apuestas' });
    }

    return res.status(200).json(apuestas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener las apuestas' });
  }
};

module.exports = { registrarApuesta, obtenerApuestas };