const mongoose = require('mongoose');

const PropietarioSchema = new mongoose.Schema({
    nombre:    { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    telefono:  { type: String, required: true }
});

module.exports = mongoose.model('Propietario', PropietarioSchema);
