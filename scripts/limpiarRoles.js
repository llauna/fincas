// scripts/limpiarRoles.js
const mongoose = require('mongoose');
const Rol = require('../src/models/Rol');
require('dotenv').config();

// Configuración de la conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Fincas';

// Roles que deseas conservar
const ROLES_PERMITIDOS = ['Administrador', 'Propietario', 'Usuario_1', 'Usuario_2'];

async function limpiarRoles() {
    try {
        // Conectar a la base de datos
        await mongoose.connect(MONGODB_URI, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true,
        });
        console.log('✅ Conectado a MongoDB');

        // 1. Eliminar roles que no están en la lista de permitidos
        const resultadoEliminacion = await Rol.deleteMany({
            nombre: { $nin: ROLES_PERMITIDOS }
        });

        console.log(`✅ Se eliminaron ${resultadoEliminacion.deletedCount} roles no deseados`);

        // 2. Verificar y crear roles permitidos que no existan
        for (const nombreRol of ROLES_PERMITIDOS) {
            const rolExistente = await Rol.findOne({ nombre: nombreRol });
            
            if (!rolExistente) {
                const nuevoRol = new Rol({ 
                    nombre: nombreRol,
                    descripcion: `Rol de ${nombreRol}`
                });
                await nuevoRol.save();
                console.log(`✅ Se creó el rol: ${nombreRol}`);
            } else {
                console.log(`ℹ️  El rol ${nombreRol} ya existe`);
            }
        }

        console.log('✅ Proceso de limpieza de roles completado');
    } catch (error) {
        console.error('❌ Error al limpiar roles:', error);
    } finally {
        // Cerrar la conexión a la base de datos
        await mongoose.connection.close();
        console.log('🔌 Conexión a MongoDB cerrada');
    }
}

// Ejecutar la función
limpiarRoles();
