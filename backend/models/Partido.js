const mongoose = require('mongoose');

const PartidoSchema = new mongoose.Schema({
  deporte: { type: String, enum: ['futbol', 'basquet'], required: true },
  equipoLocal: String,
  equipoVisitante: String,
  fecha: Date,
  estado: { type: String, enum: ['pendiente', 'finalizado'], default: 'pendiente' },
  resultado: { type: String, enum: ['local', 'empate', 'visitante', null], default: null },
  marcadorLocal: { type: Number, default: null },  // marcador del equipo local
  marcadorVisitante: { type: Number, default: null }  // marcador del equipo visitante
});

module.exports = mongoose.model('Partido', PartidoSchema);
