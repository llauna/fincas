const express = require('express');
const router = express.Router();
const Incidencia = require('../models/Incidencias'); // Modelo de la incidencia

// Obtener todas las incidencias
router.get('/', async (req, res) => {
    try {
        const incidencias = await Incidencia.find(); // Obtiene todas las incidencias
        res.status(200).json(incidencias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las incidencias', error });
    }
});

// Crear una nueva incidencia
router.post('/', async (req, res) => {
    try {
        const nuevaIncidencia = new Incidencia(req.body); // Crea una nueva incidencia
        const savedIncidencia = await nuevaIncidencia.save();
        res.status(201).json(savedIncidencia);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la incidencia', error });
    }
});

// Modificar una incidencia existente
router.put('/:id', async (req, res) => {
    try {
        const updatedIncidencia = await Incidencia.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Devuelve el documento actualizado
        );
        res.status(200).json(updatedIncidencia);
    } catch (error) {
        res.status(500).json({ message: 'Error al modificar la incidencia', error });
    }
});

// Nota: No se implementa la eliminación de incidencias porque el cliente no tiene permiso para eliminar.

module.exports = router;
