// routes/incidencias.js
const express = require('express');
const router = express.Router();
const Incidencia = require('../models/Incidencias'); // Modelo de la incidencia
const { verificarToken } = require('../middleware/auth');

// Obtener incidencias SOLO del usuario logeado
router.get('/', verificarToken, async (req, res) => {
    try {
        console.log('Solicitud recibida para obtener incidencias');
        console.log('Usuario autenticado en incidencias:', req.usuario);

        const emailUsuario = (req.usuario.email || '').toLowerCase();
        if (!emailUsuario) {
            return res.status(400).json({ message: 'El token no contiene email de usuario' });
        }

        // Filtrar por el email del usuario logeado
        const incidencias = await Incidencia.find({
            'reportadoPor.contacto': emailUsuario
        });

        console.log(`Incidencias encontradas para ${emailUsuario}:`, incidencias.length);
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
