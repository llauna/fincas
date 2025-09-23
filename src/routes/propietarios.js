// src/routes/propietarios.js
const express = require('express');
const router = express.Router();
const Propietario = require('../models/Propietario');

// Obtener todos los propietarios
router.get('/', async (req, res) => {
    try {
        const propietarios = await Propietario.find();
        res.status(200).json(propietarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener propietarios', error });
    }
});

// Crear un nuevo propietario
router.post('/', async (req, res) => {
    try {
        const nuevoPropietario = new Propietario(req.body);
        const propietarioGuardado = await nuevoPropietario.save();
        res.status(201).json(propietarioGuardado);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear propietario', err });
    }
});

// Actualizar un propietario por ID
router.put('/:id', async (req, res) => {
    try {
        const propietarioActualizado = await Propietario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!propietarioActualizado) {
            return res.status(404).json({ message: 'Propietario no encontrado' });
        }
        res.json(propietarioActualizado);
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar propietario', err });
    }
});

// Eliminar un propietario por ID
router.delete('/:id', async (req, res) => {
    try {
        const propietarioEliminado = await Propietario.findByIdAndDelete(req.params.id);
        if (!propietarioEliminado) {
            return res.status(404).json({ message: 'Propietario no encontrado' });
        }
        res.json({ message: 'Propietario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar propietario', err });
    }
});

module.exports = router;