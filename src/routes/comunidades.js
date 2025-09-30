// src/routes/comunidades.js
const express = require('express');
const router = express.Router();
const Comunidad = require('../models/Comunidad');

// Obtener todas las comunidades
router.get('/', async (req, res) => {
    try {
        const comunidades = await Comunidad.find().populate('propietarios');
        res.status(200).json(comunidades);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener comunidades', error: error.message });
    }
});

// Crear nueva comunidad
router.post('/', async (req, res) => {
    try {
        const nuevaComunidad = new Comunidad(req.body);
        const comunidadGuardada = await nuevaComunidad.save();
        res.status(201).json(comunidadGuardada);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear comunidad', error: error.message });
    }
});

// Eliminar comunidad
router.delete('/:id', async (req, res) => {
    try {
        const comunidadEliminada = await Comunidad.findByIdAndDelete(req.params.id);
        if (!comunidadEliminada) {
            return res.status(404).json({ message: 'Comunidad no encontrada' });
        }
        res.json({ message: 'Comunidad eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar comunidad', error: error.message });
    }
});

module.exports = router;

