// models/Rol.js
const mongoose = require('mongoose');

const RolSchema = new mongoose.Schema({
    nombre: {
        type: String,
        enum: ['Administrador', 'Empleado'], // Solo estos roles están permitidos
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: false
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

// Asegurar que no se puedan crear roles duplicados
RolSchema.index({ nombre: 1 }, { unique: true });

module.exports = mongoose.model('Rol', RolSchema);


