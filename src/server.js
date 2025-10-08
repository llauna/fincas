// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const usuariosRoutes = require('./routes/usuarios');
const gestionRoutes = require('./routes/gestion');
const propiedadesRouter = require('./routes/propiedades');
const administradorRouter = require('./routes/administradorFincas');
const propietariosRouter = require('./routes/propietarios');
const bancosRouter = require('./routes/bancos');
const movimientosRoutes = require('./routes/movimientos');
const comunidadesRouter = require('./routes/comunidades');
const rolRoutes = require('./routes/rol');
const cajaRoutes = require('./routes/caja');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/Fincas', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ Error de conexión:'));
db.once('open', () => {
    console.log('✅ Conectado a MongoDB');
});

// Rutas de la API
app.use('/api/usuarios', usuariosRoutes); // Login y perfil
app.use('/api/gestions', gestionRoutes);
app.use('/api/administradorfincas', administradorRouter);
app.use('/api/propiedades', propiedadesRouter);
app.use('/api/propietarios', propietariosRouter);
app.use('/api/bancos', bancosRouter);
app.use('/api/cajas', cajaRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/comunidades', comunidadesRouter);
app.use('/api/roles', rolRoutes);

// Manejar rutas no definidas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(3001, () => {
    console.log('🚀 Servidor corriendo en http://localhost:3001');
    console.log('📌 Login disponible en: POST /api/usuarios/login');
    console.log('📌 Perfil disponible en: GET /api/usuarios/perfil (requiere token)');
});
