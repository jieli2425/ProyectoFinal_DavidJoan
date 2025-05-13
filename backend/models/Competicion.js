const mongoose = require('mongoose');

const CompeticionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  deporte: { type: String, enum: ['futbol', 'basquet'], required: true },
  temporada: { type: String, required: true },
  descripcion: String
});

module.exports = mongoose.model('Competicion', CompeticionSchema);