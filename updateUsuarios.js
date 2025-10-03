// updateUsuarios.js
const mongoose = require('mongoose');
const Usuario = require('./src/models/Usuario'); // Ajusta la ruta a tu modelo

// 🔹 Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/Fincas', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ Conectado a MongoDB');
        return actualizarUsuarios();
    })
    .catch(err => {
        console.error('❌ Error de conexión:', err);
    });

async function actualizarUsuarios() {
    try {
        // Actualizar todos los usuarios que no tengan tipo
        const resultado = await Usuario.updateMany(
            { tipo: { $exists: false } }, // condición: no tienen campo tipo
            { $set: { tipo: 'cliente', rol: 'cliente' } } // valores por defecto
        );

        console.log(`✅ Usuarios actualizados: ${resultado.modifiedCount}`);
    } catch (error) {
        console.error('❌ Error al actualizar usuarios:', error);
    } finally {
        mongoose.connection.close();
    }
}
