// routes/rol.js
const express = require('express');
const router = express.Router();
const Rol = require('../models/Rol'); // Ajusta la ruta a tu modelo real
const authMiddleware = require('../middleware/auth'); // Si tienes middleware de autenticación

// 📌 Obtener todos los roles
router.get('/', authMiddleware, async (req, res) => {
    try {
        const roles = await Rol.find();
        res.json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener roles' });
    }
});

// 📌 Crear un nuevo rol
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { nombre, permisos } = req.body;
        const nuevoRol = new Rol({ nombre, permisos });
        await nuevoRol.save();
        res.status(201).json({ message: '✅ Rol creado correctamente', rol: nuevoRol });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear rol' });
    }
});

// 📌 Actualizar permisos de un rol
router.put('/:id/permisos', authMiddleware, async (req, res) => {
    try {
        const { permisos } = req.body;

        if (!Array.isArray(permisos)) {
            return res.status(400).json({ error: 'Formato de permisos inválido' });
        }

        const rol = await Rol.findByIdAndUpdate(
            req.params.id,
            { permisos },
            { new: true }
        );

        if (!rol) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        res.json({ message: '✅ Permisos actualizados correctamente', rol });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar permisos' });
    }
});

// 📌 Eliminar un rol
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const rol = await Rol.findByIdAndDelete(req.params.id);
        if (!rol) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }
        res.json({ message: '✅ Rol eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar rol' });
    }
});

module.exports = router;
