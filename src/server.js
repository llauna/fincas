//server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuarios');
const propiedadesRouter = require('./routes/propiedades');
const administradorRouter = require('./routes/administradorFincas');
const propietariosRouter = require('./routes/propietarios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
require('dotenv').config();
mongoose.connect('mongodb://localhost:27017/Fincas');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', () => {
    console.log('Conectado a MongoDB');
});

// Rutas de la API (aquí defines todas tus rutas)
app.use('/usuarios', usuarioRoutes);
app.use('/api/administradorfincas', administradorRouter);
app.use('/api/propiedades', propiedadesRouter);
app.use('/api/propietarios', propietariosRouter);

// Manejar rutas no definidas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(3001, () => {
    console.log('Servidor corriendo en localhost:3001');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email === 'OTR14' && password === '123456') {
        return res.status(200).json({ token: 'fake-jwt-token' });
    } else {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }
});