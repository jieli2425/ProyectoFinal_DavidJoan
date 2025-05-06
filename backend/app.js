const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const apuestasRoutes = require('./routes/apuestasRoutes');
const partidosRoutes = require('./routes/partidosRoutes');
const footballDataServices = require('./services/footballDataServices');

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

footballDataServices.obtenerPartidosEnVivo();

// Middleware global para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Configuración del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));