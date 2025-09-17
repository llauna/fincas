const express = require('express');
const authRoutes = require('./auth');
const usuarioRoutes = require('./usuarios');

const app = express();

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);

app.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});
