const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
    numero: String,
    fecha: Date,
    importe: Number,
    concepto: String,
    archivo: String // ruta o URL del PDF
});

const trabajoSchema = new mongoose.Schema({
    descripcion: String,
    fechaInicio: Date,
    fechaFin: Date,
    estado: { type: String, enum: ['pendiente', 'en progreso', 'finalizado'], default: 'pendiente' }
});

const proveedorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    poblacion: { type: String, required: true },
    cp: { type: String, required: true },
    tipoServicio: { type: String, required: true },
    actividad: { type: String, required: true },
    telefono: { type: String, required: true },
    email: { type: String, required: true },
    facturas: [facturaSchema],
    trabajos: [trabajoSchema]
}, { timestamps: true });

module.exports = mongoose.model('Proveedor', proveedorSchema);
