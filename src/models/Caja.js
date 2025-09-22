const mongoose = require('mongoose');

const CajaSchema = new mongoose.Schema({
    fecha:       { type: Date, required: true },
    descripcion: { type: String, required: true },
    cobros:      { type: Number, default: 0 },
    pagos:       { type: Number, default: 0 },
    saldo:       { type: Number, required: true }
});

module.exports = mongoose.model('Caja', CajaSchema);
