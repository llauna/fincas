// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const Rol = require('../models/Rol');
const router = express.Router();
const SECRET_KEY = 'mi_clave_secreta'; // Usa una variable de entorno en producción

// Registro de usuario
router.post('/register', async (req, res) => {
    const { email, password, rol } = req.body;

    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const nuevoUsuario = new Usuario({ email, password: hashedPassword, rol });
        await nuevoUsuario.save();

        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar usuario por email
        const usuario = await Usuario.findOne({ email }).populate('roles'); // roles es un array de ObjectId
        if (!usuario) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        // 2. Validar contraseña (ejemplo con bcrypt)
        const bcrypt = require('bcrypt');
        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // 3. Extraer nombres de roles
        const nombresRoles = usuario.roles.map(r => r.nombre);

        // 4. Crear payload del token
        const payload = {
            id: usuario._id,
            email: usuario.email,
            roles: nombresRoles
        };

        // 5. Firmar token con la misma clave que usa verificarToken
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secreto', { expiresIn: '8h' });

        // 6. Enviar token al cliente
        res.json({ token });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Middleware para verificar el token
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'Token no proporcionado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
        req.usuario = decoded; // Agrega los datos del usuario al objeto req
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido' });
    }
};

// Ruta protegida de ejemplo
router.get('/perfil', verificarToken, (req, res) => {
    res.json({ message: 'Acceso permitido', usuario: req.usuario });
});

module.exports = router;
