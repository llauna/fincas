const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const incidenciaSchema = new mongoose.Schema({
    idIncidencia: {
        type: String,
        default: () => uuidv4(),
        unique: true,
        trim: true
    },
    fechaHoraReporte: { type: Date, required: true, default: Date.now },
    reportadoPor: {
        nombre: { type: String, required: true, trim: true },
        contacto: { type: String, required: true, trim: true }
    },
    // Id del usuario que crea la incidencia (para poder filtrar por usuario logeado)
    reportadoPorUsuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    ubicacionEspecifica: { type: String, required: true, trim: true },
    descripcionDetallada: { type: String, required: true, trim: true },
    gravedadImpacto: {
        type: String,
        enum: ['Baja', 'Media', 'Alta', 'Crítica'],
        required: true
    },
    proveedorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor' } // Nuevo campo
}, {
    timestamps: true
});

module.exports = mongoose.model('Incidencia', incidenciaSchema);