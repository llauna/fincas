const mongoose = require('mongoose');

const AdministradorFincasSchema = new mongoose.Schema({
    idComunidad: { type: mongoose.Schema.Types.ObjectId, ref: 'Comunidad', required: true },
    nombre:      { type: String, required: true },
    telefono:    { type: String, required: true },
    email:       { type: String, required: true, unique: true },
    cif:         { type: String, required: true, unique: true }
});

module.exports = mongoose.model('AdministradorFincas', AdministradorFincasSchema);
