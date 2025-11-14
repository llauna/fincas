// middleware/auth.js
const jwt = require('jsonwebtoken');
const Rol = require('../models/Rol');

function verificarToken(req, res, next) {
    // Intentar obtener el token del encabezado Authorization (Bearer)
    let token = req.headers.authorization;
    console.log('📩 Authorization header recibido:', token);
    
    // Si no está en Authorization, intentar con x-access-token
    if (!token) {
        token = req.headers['x-access-token'];
        console.log('Buscando token en x-access-token:', token);
    } else if (token.startsWith('Bearer ')) {
        // Extraer el token del formato 'Bearer <token>'
        token = token.split(' ')[1];
    }

    if (!token) {
        console.log('⚠️ No se encontró token en los headers:', req.headers);
        return res.status(401).json({ error: 'No se proporcionó un token' });
    }
    
    console.log('🔑 Token recibido para verificación:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
        console.log('✅ Token verificado. Payload:', decoded);
        req.usuario = decoded;
        next();
    } catch (err) {
        console.error('❌ Error al verificar token:', err);
        return res.status(403).json({ 
            message: 'Token inválido o expirado',
            error: err.message 
        });
    }
}

function autorizarRoles(...rolesPermitidos) {
    return async (req, res, next) => {
        if (!req.usuario) {
            console.log('Acceso denegado: no hay usuario en el token');
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        // Normalizamos los roles permitidos a minúsculas
        const rolesPermitidosLower = rolesPermitidos.map(r => r.toLowerCase());

        // Soportar token con "rol" (string) o "roles" (array)
        let rolesUsuario = [];

        if (Array.isArray(req.usuario.roles)) {
            // Caso futuro: token con array de roles
            rolesUsuario = req.usuario.roles.map(r => r.toLowerCase());
        } else if (req.usuario.rol) {
            // Caso actual: un solo rol en el token
            rolesUsuario = [req.usuario.rol.toLowerCase()];
        }

        if (rolesUsuario.length === 0) {
            console.log('Acceso denegado, usuario sin rol en token:', req.usuario);
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        // (Opcional) validar que los rolesPermitidos existen en la colección Rol
        try {
            const rolesValidos = await Rol.find({ nombre: { $in: rolesPermitidos } }).select('nombre');
            const nombresValidos = rolesValidos.map(r => r.nombre.toLowerCase());

            const tieneAcceso = rolesUsuario.some(r =>
                rolesPermitidosLower.includes(r) && nombresValidos.includes(r)
            );

            if (!tieneAcceso) {
                console.log('Acceso denegado para roles:', rolesUsuario);
                return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
            }

            next();
        } catch (error) {
            console.error('Error al validar roles en la base de datos:', error);
            return res.status(500).json({ message: 'Error al validar roles', error: error.message });
        }
    };
}

module.exports = { verificarToken, autorizarRoles };
