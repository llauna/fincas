// routes/propiedades.js
const express = require('express');
const router = express.Router();
const Propiedad = require('../models/Propiedad'); // <--- Asegúrate de tener este modelo

// Obtener todas las propiedades (GET /api/propiedades)
router.get('/', async (req, res) => {
    try {
        const propiedades = await Propiedad.find();
        res.status(200).json(propiedades); // Envía directamente el array de propiedades
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener propiedades', error });
    }
});

// Crear una nueva propiedad (POST /api/propiedades)
router.post('/', async (req, res) => {
    try {
        const nuevaPropiedad = new Propiedad(req.body);
        const propiedadGuardada = await nuevaPropiedad.save();
        res.status(201).json(propiedadGuardada); // 201 Created
    } catch (err) {
        res.status(500).json({ message: 'Error al crear propiedad', err });
    }
});

// Actualizar una propiedad por ID (PUT /api/propiedades/:id)
router.put('/:id', async (req, res) => {
    try {
        const propiedadActualizada = await Propiedad.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(propiedadActualizada);
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar propiedad', err });
    }
});

// Eliminar una propiedad por ID (DELETE /api/propiedades/:id)
router.delete('/:id', async (req, res) => {
    try {
        await Propiedad.findByIdAndDelete(req.params.id);
        res.json({ message: 'Propiedad eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar propiedad', err });
    }
});

module.exports = router;