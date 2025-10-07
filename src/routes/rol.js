const express = require('express');
const router = express.Router();
const Rol = require('../models/Rol');
const { verificarToken, autorizarRoles } = require('../middleware/auth');

// GET /api/roles - Obtener todos los roles
router.get('/', async (req, res) => {
    try {
        const roles = await Rol.find();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/roles - Crear un nuevo rol (solo Administrador)
router.post(
    '/',
    verificarToken,
    autorizarRoles('Administrador'),
    async (req, res) => {
        const rol = new Rol({
            nombre: req.body.nombre
        });
        try {
            const newRol = await rol.save();
            res.status(201).json(newRol);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
);

module.exports = router;
