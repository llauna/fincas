// scripts/fixUserRoles.js
const mongoose = require('mongoose');
const Usuario = require('../src/models/Usuario');
const Rol = require('../src/models/Rol');
require('dotenv').config();

// Configuración de la conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Fincas';

// Mapeo de roles antiguos a los nuevos roles
const ROLES_MAPPING = {
    'cliente': 'Cliente',
    'empleado': 'Empleado',
    'admin': 'Administrador',
    'usuario_1': 'Usuario_1',
    'usuario_2': 'Usuario_2',
    'propietario': 'Propietario'
};

async function fixUserRoles() {
    try {
        // Conectar a la base de datos
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Obtener todos los usuarios
        const usuarios = await Usuario.find({});
        console.log(`📊 Total de usuarios a procesar: ${usuarios.length}`);

        // Contadores para estadísticas
        let actualizados = 0;
        let sinCambios = 0;
        let errores = 0;

        // Procesar cada usuario
        for (const usuario of usuarios) {
            try {
                // Si el rol ya es un ObjectId, saltar
                if (mongoose.Types.ObjectId.isValid(usuario.rol)) {
                    // Verificar si el ObjectId existe en la colección de roles
                    const rolExistente = await Rol.findById(usuario.rol);
                    if (rolExistente) {
                        sinCambios++;
                        continue;
                    }
                }

                // Si el rol es un string, buscar el ID correspondiente
                let rolNombre = usuario.role || usuario.rol;
                
                // Si es un string, buscar el rol correspondiente
                if (typeof rolNombre === 'string') {
                    // Normalizar el nombre del rol
                    rolNombre = rolNombre.trim().toLowerCase();
                    
                    // Mapear el nombre del rol a uno de los permitidos
                    const rolMapeado = ROLES_MAPPING[rolNombre] || 'Cliente';
                    
                    // Buscar el rol en la base de datos
                    const rolEncontrado = await Rol.findOne({ 
                        nombre: { $regex: new RegExp(rolMapeado, 'i') } 
                    });

                    if (rolEncontrado) {
                        // Actualizar el usuario con el ObjectId del rol
                        await Usuario.updateOne(
                            { _id: usuario._id },
                            { $set: { rol: rolEncontrado._id } }
                        );
                        console.log(`✅ Usuario ${usuario.email} actualizado con rol ${rolEncontrado.nombre}`);
                        actualizados++;
                    } else {
                        // Si no se encuentra el rol, asignar el rol por defecto (Cliente)
                        const rolPorDefecto = await Rol.findOne({ nombre: 'Cliente' });
                        if (rolPorDefecto) {
                            await Usuario.updateOne(
                                { _id: usuario._id },
                                { $set: { rol: rolPorDefecto._id } }
                            );
                            console.log(`⚠ Usuario ${usuario.email} actualizado con rol por defecto (Cliente)`);
                            actualizados++;
                        } else {
                            console.error(`❌ No se encontró el rol por defecto (Cliente)`);
                            errores++;
                        }
                    }
                } else {
                    console.log(`ℹ️ Usuario ${usuario.email} no requiere actualización`);
                    sinCambios++;
                }
            } catch (error) {
                console.error(`❌ Error al procesar usuario ${usuario.email}:`, error.message);
                errores++;
            }
        }

        console.log('\n📊 Resumen de la actualización:');
        console.log(`✅ Usuarios actualizados: ${actualizados}`);
        console.log(`ℹ️ Usuarios sin cambios: ${sinCambios}`);
        console.log(`❌ Errores: ${errores}`);

    } catch (error) {
        console.error('❌ Error general:', error);
    } finally {
        // Cerrar la conexión a la base de datos
        await mongoose.connection.close();
        console.log('🔌 Conexión a MongoDB cerrada');
    }
}

// Ejecutar la función
fixUserRoles();
