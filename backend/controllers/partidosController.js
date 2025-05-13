const Partido = require('../model/Partido');

const crearPartido = async (req, res) => {
  try {
    const { equipoLocal, equipoVisitante, fecha, competencia } = req.body;

    const nuevoPartido = new Partido({ equipoLocal, equipoVisitante, fecha, competencia });
    await nuevoPartido.save();

    return res.status(201).json(nuevoPartido);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear el partido' });
  }
};

const obtenerPartidos = async (req, res) => {
  const { competencia } = req.query;
  try {
    const filtro = competencia ? { competencia } : {};
    const partidos = await Partido.find(filtro).sort({ fecha: 1 });
    return res.status(200).json(partidos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los partidos' });
  }
};

const eliminarPartido = async (req, res) => {
  try {
    const partido = await Partido.findByIdAndDelete(req.params.id);
    if (!partido) return res.status(404).json({ message: 'Partido no encontrado' });

    return res.status(200).json({ message: 'Partido eliminado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar el partido' });
  }
};

module.exports = { crearPartido, obtenerPartidos, eliminarPartido };