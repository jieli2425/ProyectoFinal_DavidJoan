const mongoose = require('mongoose');

const PartidoSchema = new mongoose.Schema({
  deporte: { type: String, enum: ['futbol', 'basquet'], required: true },
  competicion: { type: String, required: true },
  equipoLocal: { type: String, required: true },
  equipoVisitante: { type: String, required: true },
  fecha: { type: Date, required: true },
  estado: { 
    type: String, 
    enum: ['pendiente', 'en_curso', 'finalizado'], 
    default: 'pendiente' 
  },
  resultado: {
    golesLocal: { type: Number, default: 0 },
    golesVisitante: { type: Number, default: 0 }
  },
  cuotaLocal: { type: Number, default: 2.0 },
  cuotaEmpate: { type: Number, default: 3.0 },
  cuotaVisitante: { type: Number, default: 2.0 },
  ganador: { 
    type: String, 
    enum: ['local', 'empate', 'visitante', null], 
    default: null 
  }
});

module.exports = mongoose.model('Partido', PartidoSchema);
