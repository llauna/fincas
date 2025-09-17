// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

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
        // Buscar el usuario
        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

        // Generar el token JWT
        const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Middleware para verificar el token
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'Token no proporcionado' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
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
