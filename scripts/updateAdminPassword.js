// Script para actualizar la contraseña del administrador
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // Asegúrate de que el path sea correcto

// Configuración de la conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Fincas';

// Importar el modelo de Usuario
const Usuario = require('../src/models/Usuario');

// Función para actualizar la contraseña
async function updateAdminPassword() {
    try {
        console.log('🔧 Iniciando actualización de contraseña...');
        
        // Conectar a la base de datos
        console.log('🔌 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI, {
           // useNewUrlParser: true,
           // useUnifiedTopology: true,
        });
        console.log('✅ Conectado a MongoDB');

        const email = 'mariadelmar@gmail.com';
        const newPassword = 'Administrador';
        
        console.log(`\n🔑 Actualizando contraseña para: ${email}`);
        
        // Generar hash de la nueva contraseña
        console.log('🔒 Generando hash de la contraseña...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        console.log('✅ Hash generado correctamente');
        
        // Buscar y actualizar el usuario
        console.log('🔍 Buscando usuario en la base de datos...');
        const result = await Usuario.findOneAndUpdate(
            { email },
            { 
                $set: { 
                    password: hashedPassword,
                    tipo: 'empleado',
                    estado: 'activo'
                } 
            },
            { new: true, upsert: false }
        );
        
        if (result) {
            console.log('\n✅ Usuario actualizado correctamente');
            console.log('ID del usuario:', result._id);
            console.log('Email:', result.email);
            console.log('Tipo de usuario:', result.tipo);
            console.log('Estado:', result.estado || 'activo');
            
            // Verificar que la contraseña se puede verificar
            const isMatch = await bcrypt.compare(newPassword, result.password);
            console.log('\n🔍 Verificación de contraseña:');
            console.log('La contraseña coincide:', isMatch ? '✅ Sí' : '❌ No');
            
            if (!isMatch) {
                console.error('❌ Error: La contraseña no coincide después de la actualización');
                process.exit(1);
            }
        } else {
            console.log('\n⚠ No se encontró el usuario con el email:', email);
            console.log('Para crear un nuevo usuario, por favor utiliza la interfaz de registro.');
        }
    } catch (error) {
        console.error('\n❌ Error al actualizar la contraseña:');
        console.error(error.message);
        if (error.errors) {
            console.error('Errores de validación:');
            console.error(JSON.stringify(error.errors, null, 2));
        }
        process.exit(1);
    } finally {
        // Cerrar la conexión a la base de datos
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('\n🔌 Conexión a MongoDB cerrada');
        }
        console.log('\n✨ Proceso completado');
    }
}

// Ejecutar la función
updateAdminPassword();
