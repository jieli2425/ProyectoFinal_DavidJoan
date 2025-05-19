const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const apuestasRoutes = require('./routes/apuestasRoutes');
const partidosRoutes = require('./routes/partidosRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const adminRoutes = require('./routes/adminRoutes');
const footballDataServices = require('./services/footballDataServices');
const actualizarPartidos = require('./services/actualizarPartidosApuestas');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error al conectar MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/apuestas', apuestasRoutes);
app.use('/api/partidos', partidosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/admin', adminRoutes);

setInterval(() => {
  footballDataServices.actualizarPartidos();
}, 1 * 60 * 1000);

setInterval(() => {
  actualizarPartidos.actualizarResultadosApuestas()
    .then(() => console.log('Resultados actualizados'))
    .catch(console.error);
}, 1 * 60 * 1000);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));