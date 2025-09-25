// models/Proveedor.js
const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    poblacion: { type: String, required: true },
    cp: { type: String, required: true },
    tipoServicio: { type: String, required: true }
});

module.exports = mongoose.model('Proveedor', proveedorSchema);