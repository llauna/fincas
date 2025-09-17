// routes/usuarios.js
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');


// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        // La respuesta debe tener el mismo formato que esperas en el frontend
        res.status(200).json({
            success: true,
            data: usuarios // ¡Esta propiedad 'data' es la que esperas!
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        const usuarioGuardado = await nuevoUsuario.save();
        res.json(usuarioGuardado);
    } catch (err) {
        console.error('Error al crear usuario:', err); // Log para errores
        res.status(500).send(err);
    }
});

module.exports = router;

