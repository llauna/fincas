// src/routes/usuarios.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

// Middleware para verificar token
function verificarToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token requerido' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
        req.user = decoded; // { id, tipo, rol }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}

// Login de usuario
router.post('/login', async (req, res) => {
    const { email, password, isPreHashed } = req.body;
    console.log("🔑 Intento de login para:", email);
    console.log('Modo pre-hasheado:', isPreHashed);

    try {
        // Buscar usuario por email
        console.log('🔍 Buscando usuario con email:', email);
        const usuario = await Usuario.findOne({ email }).populate('rol');
        
        if (!usuario) {
            console.warn(`⚠ Usuario con email ${email} no encontrado`);
            return res.status(400).json({ 
                message: 'Credenciales inválidas',
                details: 'El correo electrónico no está registrado'
            });
        }

        console.log('✅ Usuario encontrado:', {
            id: usuario._id,
            email: usuario.email,
            tienePassword: !!usuario.password,
            rol: usuario.rol?.nombre || 'Sin rol'
        });

        // Validar contraseña
        if (!usuario.password) {
            console.error("❌ El usuario no tiene contraseña almacenada");
            return res.status(500).json({ message: 'Error en la configuración del usuario' });
        }

        let esPasswordValida = false;

        // Mostrar información para depuración
        console.log('🔑 Comparando contraseñas:');
        console.log('Hash almacenado en BD:', usuario.password);
        console.log('Contraseña recibida (texto plano):', password);

        // Comparar la contraseña en texto plano con el hash almacenado
        esPasswordValida = await bcrypt.compare(password, usuario.password);

        // Si la contraseña no coincide, mostrar más detalles para depuración
        if (!esPasswordValida) {
            console.log('⚠ La contraseña no coincide');
            // Verificar si el hash almacenado es un hash bcrypt válido
            const isBcryptHash = usuario.password.startsWith('$2a$') ||
                                usuario.password.startsWith('$2b$') ||
                                usuario.password.startsWith('$2y$');
            console.log('El hash almacenado es un hash bcrypt válido:', isBcryptHash);
        }

        console.log("🔑 Contraseña válida:", esPasswordValida);

        if (!esPasswordValida) {
            console.warn("⚠ Contraseña incorrecta para el usuario:", usuario.email);
            console.log('Hash almacenado en BD:', usuario.password);
            console.log('Contraseña recibida (posiblemente hasheada):', password);
            return res.status(400).json({
                message: 'Credenciales inválidas',
                details: 'La contraseña es incorrecta'
            });
        }

        // Obtener el nombre del rol
        const rolNombre = usuario.rol?.nombre || 'SinRol';
        console.log("👤 Rol del usuario:", rolNombre);

        // Generar token
        const token = jwt.sign(
            {
                id: usuario._id,
                tipo: usuario.tipo,
                rol: rolNombre
            },
            process.env.JWT_SECRET || 'secreto',
            { expiresIn: '8h' }
        );

        console.log("✅ Token generado correctamente");

        // Respuesta exitosa
        res.json({
            token,
            user: {
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                tipo: usuario.tipo,
                rol: rolNombre
            }
        });

    } catch (error) {
        console.error("❌ Error en el login:", error);
        res.status(500).json({
            message: 'Error en el servidor',
            error: error.message
        });
    }
});

// Obtener todos los usuarios (solo admin)
router.get('/', verificarToken, async (req, res) => {
    try {
        if (req.user.rol !== 'Administrador') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        
        const usuarios = await Usuario.find().select('-password').populate('rol');
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ 
            message: 'Error en el servidor', 
            error: error.message 
        });
    }
});

// Obtener un usuario por ID (solo admin)
router.get('/:id', verificarToken, async (req, res) => {
    try {
        if (req.user.rol !== 'Administrador') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        
        const usuario = await Usuario.findById(req.params.id).select('-password').populate('rol');
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ 
            message: "Error en el servidor",
            error: error.message 
        });
    }
});

// Crear un nuevo usuario (solo admin)
router.post('/', verificarToken, async (req, res) => {
    try {
        if (req.user.rol !== 'Administrador') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        
        const { password, ...userData } = req.body;
        
        // Validar contraseña
        if (!password || password.length < 6) {
            return res.status(400).json({ 
                message: 'La contraseña es obligatoria y debe tener al menos 6 caracteres' 
            });
        }
        
        // Verificar si el email ya existe
        const existeUsuario = await Usuario.findOne({ email: userData.email });
        if (existeUsuario) {
            return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
        }
        
        let hashedPassword;
        
        // Aplicamos bcrypt a la contraseña (ya hasheada en el cliente)
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
        
        // Crear el usuario (eliminamos isPreHashed para no guardarlo en la BD)
        const { isPreHashed, ...userDataWithoutFlag } = userData;
        const nuevoUsuario = new Usuario({
            ...userDataWithoutFlag,
            password: hashedPassword
        });
        
        await nuevoUsuario.save();
        
        // Obtener el usuario recién creado sin la contraseña
        const usuarioCreado = await Usuario.findById(nuevoUsuario._id)
            .select('-password')
            .populate('rol');
        
        res.status(201).json({
            message: 'Usuario creado exitosamente',
            usuario: usuarioCreado
        });
        
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ 
            message: 'Error al crear usuario',
            error: error.message 
        });
    }
});

// Actualizar usuario (solo admin)
router.put('/:id', verificarToken, async (req, res) => {
    try {
        if (req.user.rol !== 'Administrador') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        
        const { password, ...updateData } = req.body;
        
        // Si se está actualizando la contraseña, la hasheamos
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ 
                    message: 'La contraseña debe tener al menos 6 caracteres' 
                });
            }
            // Aplicamos el mismo hash que en el registro
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password').populate('rol');
        
        if (!usuarioActualizado) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        res.json({
            message: 'Usuario actualizado exitosamente',
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ 
            message: 'Error al actualizar usuario',
            error: error.message 
        });
    }
});

// Eliminar usuario (solo admin)
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        // Verificar que el usuario que hace la petición es administrador
        if (req.user.rol !== 'Administrador') {
            return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador' });
        }

        // Verificar que no se está intentando eliminar a sí mismo
        if (req.params.id === req.user.id) {
            return res.status(400).json({ message: 'No puedes eliminarte a ti mismo' });
        }

        // Buscar el usuario a eliminar
        const usuarioAEliminar = await Usuario.findById(req.params.id);
        
        if (!usuarioAEliminar) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar que no se está intentando eliminar a otro administrador
        if (usuarioAEliminar.rol === 'Administrador') {
            return res.status(403).json({ message: 'No puedes eliminar a otro administrador' });
        }

        // Eliminar el usuario
        await Usuario.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ 
            message: 'Error al eliminar usuario',
            error: error.message 
        });
    }
});

// Obtener perfil del usuario actual
router.get('/perfil/me', verificarToken, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.user.id).populate('rol');
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            tipo: usuario.tipo,
            rol: usuario.rol?.nombre || 'SinRol'
        });
        
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ 
            message: 'Error en el servidor',
            error: error.message 
        });
    }
});

// Cambiar rol de usuario (solo admin)
router.put('/:id/rol', verificarToken, async (req, res) => {
    try {
        if (req.user.rol !== 'Administrador') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        
        const { rol } = req.body;
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            { rol },
            { new: true, runValidators: true }
        ).select('-password').populate('rol');
        
        if (!usuarioActualizado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.json({
            message: 'Rol actualizado exitosamente',
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        res.status(500).json({ 
            message: 'Error al actualizar rol',
            error: error.message 
        });
    }
});

module.exports = router;
