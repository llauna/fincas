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

        const rolUsuario = req.usuario.rol;
        const emailUsuario = (req.usuario.email || '').toLowerCase();

        let query = {};

        if (rolUsuario === 'Administrador') {
            // Admin ve todas las incidencias
            console.log('Usuario administrador, devolviendo todas las incidencias');
        } else {
            // Otros roles: filtrar por su email
            if (!emailUsuario) {
                return res.status(400).json({ message: 'El token no contiene email de usuario' });
            }
            query = { 'reportadoPor.contacto': emailUsuario };
            console.log(`Usuario no admin, filtrando incidencias por email: ${emailUsuario}`);
        }

        const incidencias = await Incidencia
            .find(query)
            .populate('comunidad')      // Asegúrate de que el campo exista en el modelo
            .populate('propietario');   // Idem, campo referencia a propietario

        console.log('Incidencias encontradas:', incidencias.length);
        incidencias.forEach((i) => {
            console.log('INCIDENCIA DEBUG:', {
                id: i._id,
                comunidad: i.comunidad,
                propietario: i.propietario,
            });
        });

        res.status(200).json(incidencias);
    } catch (error) {
        console.error('Error al obtener incidencias:', error);
        res.status(500).json({ message: 'Error al obtener las incidencias', error: error.message });
    }
});

// 🔹 NUEVA RUTA: obtener una incidencia por ID
router.get('/:id', verificarToken, async (req, res) => {
    try {
        const incidencia = await Incidencia
            .findById(req.params.id)
            .populate('comunidad')
            .populate('propietario');

        if (!incidencia) {
            return res.status(404).json({ message: 'Incidencia no encontrada' });
        }

        res.status(200).json(incidencia);
    } catch (error) {
        console.error('Error al obtener incidencia por id:', error);
        res.status(500).json({ message: 'Error al obtener la incidencia', error: error.message });
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
