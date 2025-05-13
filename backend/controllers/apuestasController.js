const Apuesta = require('../model/Apuesta');
const Partido = require('../model/Partido');
const Usuario = require('../model/Usuario');


const registrarApuesta = async (req, res) => {
  try {
    const { usuarioId, partidoId, pronostico, monedasApostadas } = req.body;

    const partido = await Partido.findById(partidoId);
    const usuario = await Usuario.findById(usuarioId);

    if (!partido || !usuario) {
      return res.status(404).json({ message: 'Partido o Usuario no encontrado' });
    }

    const apuesta = new Apuesta({
      usuario: usuarioId,
      partido: partidoId,
      eleccion: pronostico,
      monedasApostadas,
      monto: monedasApostadas
    });

    await apuesta.save();

    res.status(201).json({ message: 'Apuesta registrada con éxito', apuesta });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar la apuesta', error });
  }
};

// const registrarApuesta = async (req, res) => {
//   try {
//     const { userId, partidoId, apuesta } = req.body;

//     const partido = await Partido.findById(partidoId);
//     if (!partido) {
//       return res.status(404).json({ message: 'Partido no encontrado' });
//     }

//     const apuestaExistente = await Apuesta.findOne({ userId, partidoId });
//     if (apuestaExistente) {
//       return res.status(400).json({ message: 'Ya has apostado en este partido' });
//     }

//     const nuevaApuesta = new Apuesta({ userId, partidoId, apuesta });
//     await nuevaApuesta.save();

//     return res.status(201).json(nuevaApuesta);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Error al registrar la apuesta' });
//   }
// };

const obtenerApuestas = async (req, res) => {
  try {
    const { userId } = req.params;

    const apuestas = await Apuesta.find({ usuario: userId })
      .populate('partido')
      .populate('usuario', 'nombre email');

    res.status(200).json(apuestas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las apuestas', error });
  }
};
// const obtenerApuestas = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const apuestas = await Apuesta.find({ userId }).populate('partidoId');

//     if (!apuestas) {
//       return res.status(404).json({ message: 'No se encontraron apuestas' });
//     }

//     return res.status(200).json(apuestas);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Error al obtener las apuestas' });
//   }
// };

module.exports = {obtenerApuestas, registrarApuesta };