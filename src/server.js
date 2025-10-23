// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const usuariosRoutes = require('./routes/usuarios');
const gestionRoutes = require('./routes/gestion');
const propiedadesRouter = require('./routes/propiedades');
const propietariosRouter = require('./routes/propietarios');
const bancosRouter = require('./routes/bancos');
const movimientosRoutes = require('./routes/movimientos');
const comunidadesRoutes = require('./routes/comunidades');
const rolRoutes = require('./routes/rol');
const cajaRoutes = require('./routes/caja');
const incidenciasRoutes = require('./routes/incidencias');
const empresasRoutes = require('./routes/empresas');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

console.log(process.env.JWT_SECRET);

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
app.use('/api/propiedades', propiedadesRouter);
app.use('/api/propietarios', propietariosRouter);
app.use('/api/bancos', bancosRouter);
app.use('/api/cajas', cajaRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/comunidades', comunidadesRoutes);
app.use('/api/incidencias', incidenciasRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/incidencias', incidenciasRoutes);

// Manejar rutas no definidas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(3001, () => {
    console.log('🚀 Servidor corriendo en http://localhost:3001');
});
