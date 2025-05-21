const Apuesta = require('../models/Apuesta');
const Partido = require('../models/Partido');
const Usuario = require('../models/Usuario');
const mongoose = require('mongoose');

const registrarApuesta = async (req, res) => {
  try {
    const usuarioId = req.user.userId;
    const { partidoId, eleccion, monedasApostadas } = req.body;

    const partido = await Partido.findById(partidoId);
    if (!partido) {
      return res.status(404).json({ message: 'Partido no encontrado' });
    }

    if (partido.estado !== 'pendiente') {
      if (partido.estado === 'finalizado') {
        partido.estado = 'pendiente';
        await partido.save();

        setTimeout(async () => {
          await Partido.findByIdAndUpdate(partidoId, { estado: 'finalizado' });
          console.log(`Partido ${partidoId} volvió a estado finalizado tras 5 segundos`);
        }, 5000);
      } else {

        return res.status(400).json({ message: 'No se pueden realizar apuestas en este partido' });
      }
    }

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    if (usuario.monedas < monedasApostadas) {
      return res.status(400).json({ message: 'No tienes suficientes monedas' });
    }

    const apuestaExistente = await Apuesta.findOne({ usuario: usuarioId, partido: partidoId });
    if (apuestaExistente) {
      return res.status(400).json({ message: 'Ya has realizado una apuesta en este partido' });
    }

    let cuota;
    switch (eleccion) {
      case 'local': cuota = partido.cuotaLocal; break;
      case 'empate': cuota = partido.cuotaEmpate; break;
      case 'visitante': cuota = partido.cuotaVisitante; break;
      default: return res.status(400).json({ message: 'Elección inválida' });
    }

    const montoPotencial = monedasApostadas * cuota;

    const apuesta = new Apuesta({
      usuario: usuarioId,
      partido: partidoId,
      eleccion,
      monedasApostadas,
      monto: montoPotencial
    });

    usuario.monedas -= monedasApostadas;

    await Promise.all([
      apuesta.save(),
      usuario.save()
    ]);

    res.status(201).json({
      message: 'Apuesta registrada con éxito',
      apuesta,
      monedasRestantes: usuario.monedas
    });
  } catch (error) {
    console.error('Error al registrar apuesta:', error);
    res.status(500).json({ message: 'Error al registrar la apuesta' });
  }
};

const obtenerApuestas = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId || req.user.userId;
    const apuestas = await Apuesta.find({ usuario: usuarioId })
      .populate('partido')
      .populate('usuario', 'nombre email monedas')
      .sort({ fecha: -1 });

    res.status(200).json(apuestas);
  } catch (error) {
    console.error('Error al obtener apuestas:', error);
    res.status(500).json({ message: 'Error al obtener las apuestas' });
  }
};

const resolverApuestasFinalizadas = async (req, res) => {
  try {
    const apuestasPendientes = await Apuesta.find({ resultado: 'pendiente' }).populate('partido usuario');

    const apuestasFinalizadas = apuestasPendientes.filter(a => a.partido !== null && a.partido.estado === 'finalizado');

    const partidosParaResetear = new Set();

    const resultados = [];

    for (const apuesta of apuestasFinalizadas) {
      const esGanadora = apuesta.eleccion === apuesta.partido.ganador;
      apuesta.ganadora = esGanadora;
      apuesta.resultado = esGanadora ? 'ganada' : 'perdida';

      if (esGanadora) {
        const usuario = await Usuario.findById(apuesta.usuario._id);
        usuario.monedas += apuesta.monto;
        await usuario.save();
      }

      partidosParaResetear.add(apuesta.partido._id.toString());

      await apuesta.save();

      resultados.push({
        apuestaId: apuesta._id,
        resultado: apuesta.resultado,
        ganadora: apuesta.ganadora,
      });
    }


    for (const partidoId of partidosParaResetear) {
      await Partido.findByIdAndUpdate(partidoId, { estado: 'pendiente', ganador: null, resultado: null });
    }

    res.status(200).json({ message: 'Apuestas resueltas y partidos reiniciados', resultados });
  } catch (error) {
    console.error('Error al resolver apuestas:', error);
    res.status(500).json({ message: 'Error al resolver apuestas finalizadas' });
  }
};

const eliminarMisApuestas = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;

    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const resultado = await Apuesta.deleteMany({
      usuario: new mongoose.Types.ObjectId(usuarioId)
    });

    res.status(200).json({
      mensaje: 'Todas las apuestas eliminadas correctamente',
      eliminadas: resultado.deletedCount
    });
  } catch (error) {
    console.error('Error al eliminar apuestas:', error);
    res.status(500).json({ error: 'Error del servidor al eliminar apuestas' });
  }
};

module.exports = { 
  registrarApuesta, 
  obtenerApuestas,
  resolverApuestasFinalizadas,
  eliminarMisApuestas
};