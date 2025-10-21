const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Importa uuid para generar identificadores únicos

const incidenciaSchema = new mongoose.Schema({
        idIncidencia: {
            type: String,
            default: () => uuidv4(), // Genera automáticamente un UUID
            unique: true,
            trim: true
        },
        fechaHoraReporte: { type: Date, required: true, default: Date.now },
        reportadoPor: {
            nombre: { type: String, required: true, trim: true }, // Aquí puedes asignar el nombre del propietario del piso
            contacto: { type: String, required: true, trim: true }
        },
        ubicacionEspecifica: { type: String, required: true, trim: true },
        descripcionDetallada: { type: String, required: true, trim: true },
        gravedadImpacto: {
            type: String,
            enum: ['Baja', 'Media', 'Alta', 'Crítica'],
            required: true
        }
    },
    {
        timestamps: true // añade createdAt y updatedAt automáticamente
    });

module.exports = mongoose.model('Incidencia', incidenciaSchema);

