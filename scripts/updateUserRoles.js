// updateUserRoles.js
const mongoose = require('mongoose');
const Usuario = require('../src/models/Usuario'); // Ajusta la ruta si es necesario
const Rol = require('../src/models/Rol'); // Ajusta la ruta si es necesario


const MONGO_URI = 'mongodb://localhost:27017/Fincas';

async function actualizarRolesUsuarios() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const rolCliente = await Rol.findOne({ nombre: "Cliente" });
        const rolEmpleado = await Rol.findOne({ nombre: "Empleado" });

        if (!rolCliente || !rolEmpleado) {
            console.error("❌ No se encontraron los roles 'Cliente' o 'Empleado'.");
            return;
        }

        // Usar el driver nativo para evitar el cast a ObjectId
        const usuariosCollection = mongoose.connection.db.collection('usuarios');

        const resCliente = await usuariosCollection.updateMany(
            { rol: "cliente" },
            { $set: { rol: rolCliente._id } }
        );

        const resEmpleado = await usuariosCollection.updateMany(
            { rol: "empleado" },
            { $set: { rol: rolEmpleado._id } }
        );

        console.log(`✅ Usuarios actualizados:
    Cliente -> ${resCliente.modifiedCount} documentos
    Empleado -> ${resEmpleado.modifiedCount} documentos`);

        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ Error actualizando roles de usuarios:", error);
    }
}

actualizarRolesUsuarios();
