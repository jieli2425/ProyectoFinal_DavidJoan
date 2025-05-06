const mongoose = require('mongoose');

const ApuestaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  partidoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partido', required: true },
  eleccion: { type: String, enum: ['local', 'empate', 'visitante'], required: true },
  ganadora: { type: Boolean, default: null },
  monto: { type: Number, required: true },
  estado: { type: String, enum: ['pendiente', 'resuelta'], default: 'pendiente' },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Apuesta', ApuestaSchema);
