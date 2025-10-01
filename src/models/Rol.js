// models/Rol.js
const mongoose = require('mongoose');

const RolSchema = new mongoose.Schema({
    nombre: {
        type: String,
        enum: ['Administrador', 'Propietario', 'Usuario_1', 'Usuario_2'],
        required: true
    }
});

module.exports = mongoose.model('Rol', RolSchema);

