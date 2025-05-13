const mongoose = require('mongoose');

const ApuestaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  partido: { type: mongoose.Schema.Types.ObjectId, ref: 'Partido', required: true },
  eleccion: { type: String, enum: ['local', 'empate', 'visitante'], required: true },
  ganadora: { type: Boolean, default: null },
  monto: { type: Number, required: true },
  monedasApostadas: { type: Number, required: true },
  resultado: { type: String, enum: ['ganada', 'perdida', 'pendiente'], default: 'pendiente' },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Apuesta', ApuestaSchema);