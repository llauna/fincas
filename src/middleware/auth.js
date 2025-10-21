// middleware/auth.js
const jwt = require('jsonwebtoken');
const Rol = require('../models/Rol');

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log('📩 Authorization header recibido:', authHeader);
    if (!authHeader) {
        console.warn('No se ha recibió cabecera Authorization');
        return res.status(401).json({ message: 'Token requerido' });
    }

    const token = authHeader.split(' ')[1]; // Quitar "Bearer"
    console.log('🔑 Token extraído:', token);

    if (!token) {
        console.warn('⚠️ No se pudo extraer el token');
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secreto', (err, usuario) => {
        if (err) {
            console.error('Error al verificar token:', err); // Imprime el error
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }
        console.log('✅ Token verificado. Payload:', usuario);
        req.usuario = usuario;
        next();
    });
}

function autorizarRoles(...rolesPermitidos) {
    return async (req, res, next) => {
        if (!req.usuario || !req.usuario.roles) {
            console.log('Acceso denegado para el rol:', req.usuario?.rol); // Verifica el rol
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        // Validar que los rolesPermitidos existen en la colección Rol
        const rolesValidos = await Rol.find({ nombre: { $in: rolesPermitidos } }).select('nombre');
        const nombresValidos = rolesValidos.map(r => r.nombre.toLowerCase());

        // Convertir roles del usuario a minúsculas
        const rolesUsuario = req.usuario.roles.map(r => r.toLowerCase());

        // Comprobar si hay intersección
        const tieneAcceso = rolesUsuario.some(r => nombresValidos.includes(r));

        if (!tieneAcceso) {
            console.log('Acceso denegado para roles:', rolesUsuario);
            return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
        }
        next();
    };
}

module.exports = { verificarToken, autorizarRoles };
