const mongoose = require('mongoose');

const ComunidadSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    direccion: { type: String },
    poblacion: { type: String },
    cp: { type: String },
    provincia: { type: String },
    propietarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Propietario' }]
}, { timestamps: true });

module.exports = mongoose.model('Comunidad', ComunidadSchema);


