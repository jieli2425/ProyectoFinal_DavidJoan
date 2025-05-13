const Usuario = require('../models/Usuario');

const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

const modificarMonedas = async (req, res) => {
  const { id } = req.params;
  const { monedas } = req.body;

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usuario.monedas = monedas;
    await usuario.save();

    res.json({ message: 'Monedas actualizadas', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al modificar monedas' });
  }
};


module.exports = {
  obtenerPerfil,
  modificarMonedas,
};