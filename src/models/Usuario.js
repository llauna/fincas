// models/Usuario.js
const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tipo: { type: String, enum: ['empleado', 'cliente'], default: 'cliente' },
    rol: { type: mongoose.Schema.Types.ObjectId, ref: 'Rol' }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', UsuarioSchema);
