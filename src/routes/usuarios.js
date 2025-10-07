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

// GET /api/usuarios - Listar todos los usuarios
router.get('/', verificarToken, async (req, res) => {
    try {
        // Si quieres que solo los administradores puedan ver la lista:
        // if (req.user.rol !== 'Administrador') {
        //     return res.status(403).json({ message: 'Acceso denegado' });
        // }

        const usuarios = await Usuario.find().populate('rol');
        res.json(usuarios);
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// POST /api/usuarios/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario por email y poblar el rol
        const usuario = await Usuario.findOne({ email }).populate('rol');
        if (!usuario) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Comparar contraseñas
        const esPasswordValida = await bcrypt.compare(password, usuario.password);
        if (!esPasswordValida) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Crear token JWT
        const token = jwt.sign(
            { id: usuario._id, tipo: usuario.tipo, rol: usuario.rol.nombre },
            process.env.JWT_SECRET || 'secreto',
            { expiresIn: '8h' }
        );

        // Devolver token y datos del usuario
        res.json({
            token,
            user: {
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                tipo: usuario.tipo,
                rol: usuario.rol.nombre
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// GET /api/usuarios/perfil (protegido)
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
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// DELETE /api/usuarios/:id - Eliminar usuario
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        if (req.user.rol !== 'Administrador') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// PUT /api/usuarios/:id - Editar usuario
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
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(usuarioActualizado);
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});


module.exports = router;
