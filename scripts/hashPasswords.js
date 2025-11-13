const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('../src/models/Usuario'); // Ajusta la ruta a tu modelo

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/Fincas', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ Conectado a MongoDB');
        return actualizarPasswords();
    })
    .catch(err => {
        console.error('❌ Error de conexión:', err);
    });

async function actualizarPasswords() {
    try {
        const usuarios = await Usuario.find();

        for (const usuario of usuarios) {
            // Si la contraseña ya está hasheada, la saltamos
            if (usuario.password && usuario.password.startsWith('$2b$')) {
                console.log(`⏩ Usuario ${usuario.email} ya tiene contraseña hasheada`);
                continue;
            }

            // Hashear la contraseña actual
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(usuario.password, salt);

            usuario.password = hashedPassword;
            await usuario.save();

            console.log(`🔹 Contraseña actualizada para: ${usuario.email}`);
        }

        console.log('✅ Todas las contraseñas han sido actualizadas');
    } catch (error) {
        console.error('❌ Error al actualizar contraseñas:', error);
    } finally {
        mongoose.connection.close();
    }
}
