const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ },
  nombre: { type: String, required: true }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
