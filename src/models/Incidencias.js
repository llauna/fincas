const mongoose = require('mongoose');

const IncidenciaSchema = new mongoose.Schema({
    descripcion:   { type: String, required: true },
    estado:        { type: String, enum: ['Abierta', 'En proceso', 'Resuelta'], default: 'Abierta' },
    fechaApertura: { type: Date, required: true, default: Date.now },
    prioridad:     { type: String, enum: ['Alta', 'Media', 'Baja'], required: true }
});

module.exports = mongoose.model('Incidencia', IncidenciaSchema);
