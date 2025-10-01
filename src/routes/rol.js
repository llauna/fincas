// routes/rol.js
const express = require('express');
const router = express.Router();
const Rol = require('../models/Rol'); // Importa el modelo corregido


// GET /api/roles - Obtener todos los roles
router.get('/', async (req, res) => {
    try {
        const roles = await Rol.find();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/roles - Crear un nuevo rol
router.post('/', async (req, res) => {
    const rol = new Rol({
        nombre: req.body.nombre // Viene del frontend
    });
    try {
        const newRol = await rol.save();
        res.status(201).json(newRol);
    } catch (err) {
        // Código 400 para errores del cliente (ej. rol ya existe)
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;