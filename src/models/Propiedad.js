const mongoose = require('mongoose');

const PropiedadSchema = new mongoose.Schema({
    idPropietario: { type: mongoose.Schema.Types.ObjectId, ref: 'Propietario', required: true },
    direccion:     { type: String, required: true },
    numero:        { type: String, required: true },
    poblacion:     { type: String, required: true },
    cp:            { type: String, required: true },
    planta:        { type: String, required: true },
    coeficiente:   { type: Number, required: true }
});

module.exports = mongoose.model('Propiedad', PropiedadSchema);
