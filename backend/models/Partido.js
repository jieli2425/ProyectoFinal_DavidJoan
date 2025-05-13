const mongoose = require('mongoose');

const PartidoSchema = new mongoose.Schema({
  deporte: { type: String, enum: ['futbol', 'basquet'], required: true },
  competicion: { type: String, ref: 'Competicion' },
  equipoLocal: String,
  equipoVisitante: String,
  fecha: Date,
  estado: { type: String, enum: ['pendiente', 'finalizado'], default: 'pendiente' },
  resultado: { type: String, enum: ['local', 'empate', 'visitante'], default: null },
  marcadorLocal: { type: Number, default: null },
  marcadorVisitante: { type: Number, default: null }
});

module.exports = mongoose.model('Partido', PartidoSchema);
