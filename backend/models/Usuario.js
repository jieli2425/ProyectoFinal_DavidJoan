const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nie: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  monedas: { type: Number, default: 250 },
  isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('Usuario', usuarioSchema);