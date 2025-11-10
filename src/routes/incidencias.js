const express = require('express');
const router = express.Router();
const Incidencia = require('../models/Incidencias'); // Modelo de la incidencia

// Obtener todas las incidencias
router.get('/', async (req, res) => {
    try {
        console.log('Solicitud recibida para obtener incidencias');
        const incidencias = await Incidencia.find().populate('reportadoPor', 'nombre email');
        console.log('Incidencias encontradas:', incidencias.length);
        
        // Log the first few incidences for debugging
        if (incidencias.length > 0) {
            console.log('Primeras 3 incidencias:', incidencias.slice(0, 3).map(i => ({
                id: i._id,
                reportadoPor: i.reportadoPor,
                descripcion: i.descripcionDetallada
            })));
        }
        
        res.status(200).json(incidencias);
    } catch (error) {
        console.error('Error al obtener incidencias:', error);
        res.status(500).json({ message: 'Error al obtener las incidencias', error: error.message });
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
