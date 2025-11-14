// routes/rol.js
const express = require('express');
const router = express.Router();
const Rol = require('../models/Rol');
const { verificarToken } = require('../middleware/auth');

// 📌 Obtener todos los roles
router.get('/', verificarToken, async (req, res) => {
    try {
        const roles = await Rol.find();
        res.json(roles);
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ error: 'Error al obtener roles' });
    }
});

// 📌 Crear un nuevo rol
router.post('/', verificarToken, async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({
                error: 'El nombre del rol es requerido',
                detalles: 'Debe proporcionar un nombre para el rol'
            });
        }

        // Normalizar el nombre del rol (primera letra mayúscula, resto minúsculas)
        const nombreNormalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

        // Verificar si el rol ya existe (ignorando mayúsculas/minúsculas)
        const rolExistente = await Rol.findOne({
            nombre: { $regex: new RegExp(`^${nombre}$`, 'i') }
        });

        if (rolExistente) {
            return res.status(400).json({
                error: 'Rol duplicado',
                detalles: 'Ya existe un rol con ese nombre'
            });
        }

        const nuevoRol = new Rol({
            nombre: nombreNormalizado,
            permisos: [] // Permisos iniciales vacíos
        });

        await nuevoRol.save();

        res.status(201).json({
            mensaje: '✅ Rol creado correctamente',
            rol: nuevoRol
        });
    } catch (error) {
        console.error('Error al crear rol:', error);
        res.status(500).json({
            error: 'Error al crear rol',
            detalles: error.message
        });
    }
});

// 📌 Actualizar permisos de un rol
router.put('/:id/permisos', verificarToken, async (req, res) => {
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
router.delete('/:id', verificarToken, async (req, res) => {
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
