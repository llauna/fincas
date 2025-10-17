const mongoose = require('mongoose');

const incidenciaSchema = new mongoose.Schema({
    idIncidencia: { type: String, required: true, unique: true, trim: true },
    fechaHoraReporte: { type: Date, required: true, default: Date.now },
    reportadoPor: {
        nombre: { type: String, required: true, trim: true },
        contacto: { type: String, required: true, trim: true }
    },
    ubicacionEspecifica: { type: String, required: true, trim: true },
    titulo: { type: String, required: true, trim: true },
    descripcionDetallada: { type: String, required: true, trim: true },
    gravedadImpacto: {
        type: String,
        enum: ['Baja', 'Media', 'Alta', 'Crítica'],
        required: true
    },
    categoria: { type: String, required: true, trim: true },

},
    {
    timestamps: true // añade createdAt y updatedAt automáticamente
    }
);

module.exports = mongoose.model('Incidencia', incidenciaSchema);
