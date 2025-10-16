//src/routes/usuarios.js
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

// 📌 GET /api/usuarios - Listar todos los usuarios (protegido)
router.get('/', verificarToken, async (req, res) => {
    try {
        const usuarios = await Usuario.find().populate('rol');
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// 📌 GET /api/usuarios/:id - Obtener un usuario por ID (protegido)
router.get('/:id', verificarToken, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).populate('rol');
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// 📌 POST /api/usuarios - Crear un nuevo usuario (protegido, solo admin)
router.post('/', verificarToken, async (req, res) => {
    try {
        if (req.user.rol !== 'Administrador') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ message: "Error al crear usuario" });
    }
});

// 📌 PUT /api/usuarios/:id - Actualizar usuario (protegido, solo admin)
router.put('/:id', verificarToken, async (req, res) => {
    try {
        if (req.user.rol !== 'Administrador') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('rol');
        if (!usuarioActualizado) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar usuario" });
    }
});

// 📌 DELETE /api/usuarios/:id - Eliminar usuario (protegido, solo admin)
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        if (req.user.rol !== 'Administrador') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario" });
    }
});

// 📌 POST /api/usuarios/login - Autenticación con logs y validaciones
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("📩 Datos recibidos en /login:", { email, password });

    try {
        // Buscar usuario por email
        const usuario = await Usuario.findOne({ email }).populate('rol');
        console.log("🔍 Usuario encontrado:", usuario);

        if (!usuario) {
            console.warn("⚠ Usuario no encontrado");
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Validar contraseña
        if (!usuario.password) {
            console.error("❌ El usuario no tiene contraseña almacenada");
            return res.status(500).json({ message: 'Error: contraseña no definida en el servidor' });
        }

        const esPasswordValida = await bcrypt.compare(password, usuario.password);
        console.log("🔑 Contraseña válida:", esPasswordValida);

        if (!esPasswordValida) {
            console.warn("⚠ Contraseña incorrecta");
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Proteger acceso a rol.nombre
        const rolNombre = usuario.rol?.nombre || 'SinRol';
        console.log("👤 Rol del usuario:", rolNombre);

        // Generar token
        const token = jwt.sign(
            { id: usuario._id, tipo: usuario.tipo, rol: rolNombre },
            process.env.JWT_SECRET || 'secreto',
            { expiresIn: '8h' }
        );

        console.log("✅ Token generado correctamente");

        // Respuesta final
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
        console.error("❌ Error en /login:", error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

// 📌 GET /api/usuarios/perfil - Perfil del usuario autenticado
router.get('/perfil', verificarToken, async (req, res) => {
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
            rol: usuario.rol.nombre
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// PUT /api/usuarios/:id/rol - Cambiar rol de usuario (solo admin)
router.put('/:id/rol', verificarToken, async (req, res) => {
    try {
        if (req.user.rol !== 'Administrador') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        const { rol } = req.body;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            { rol },
            { new: true }
        ).populate('rol');
        if (!usuarioActualizado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar rol' });
    }
});


module.exports = router;
