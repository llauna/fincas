// src/routes/comunidades.js
const express = require('express');
const router = express.Router();
const Comunidad = require('../models/Comunidad');

// Ruta para obtener todas las comunidades
router.get('/', async (req, res) => {
    try {
        const comunidades = await Comunidad.find();
        res.status(200).json(comunidades);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las comunidades', error });
    }
});

// Ruta para crear una nueva comunidad
router.post('/', async (req, res) => {
    try {
        const nuevaComunidad = new Comunidad(req.body);
        const comunidadGuardada = await nuevaComunidad.save();
        res.status(201).json(comunidadGuardada);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear la comunidad', err });
    }
});

// Ruta para eliminar una comunidad por ID
router.delete('/:id', async (req, res) => {
    try {
        const comunidadEliminada = await Comunidad.findByIdAndDelete(req.params.id);
        if (!comunidadEliminada) {
            return res.status(404).json({ message: 'Comunidad no encontrada' });
        }
        res.json({ message: 'Comunidad eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar la comunidad', err });
    }
});

module.exports = router;