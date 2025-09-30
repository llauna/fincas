// src/routes/propietarios.js
const express = require('express');
const router = express.Router();
const Propietario = require('../models/Propietario');
const Propiedad = require('../models/Propiedad');
//const AdministradorFincas = require('../models/AdministradorFincas');

// Eliminar un propietario por ID
router.delete('/:id', async (req, res) => {
    try {
        const propietarioId = req.params.id;

        // Primero, eliminar todas las propiedades asociadas a este propietario
        await Propiedad.deleteMany({ idPropietario: propietarioId });

        // Luego, eliminar el propietario
        const propietarioEliminado = await Propietario.findByIdAndDelete(propietarioId);

        if (!propietarioEliminado) {
            return res.status(404).json({ message: 'Propietario no encontrado' });
        }
        res.json({ message: 'Propietario y sus propiedades asociadas han sido eliminados correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el propietario', err });
    }
});


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
router.post('/:idPropietario/unir-comunidad/:idComunidad', async (req, res) => {
    try {
        const propietario = await Propietario.findById(req.params.idPropietario);
        const comunidad = await Comunidad.findById(req.params.idComunidad);

        if (!propietario || !comunidad) {
            return res.status(404).json({ message: 'Propietario o comunidad no encontrada' });
        }

        // Añadir comunidad al propietario
        if (!propietario.comunidades.includes(comunidad._id)) {
            propietario.comunidades.push(comunidad._id);
            await propietario.save();
        }

        // Añadir propietario a la comunidad
        if (!comunidad.propietarios.includes(propietario._id)) {
            comunidad.propietarios.push(propietario._id);
            await comunidad.save();
        }

        res.json({ message: 'Propietario unido a comunidad correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al unir propietario a comunidad', error: error.message });
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

// Crear un nuevo propietario
router.post('/', async (req, res) => {
    try {
        const nuevoPropietario = new Propietario(req.body);
        await nuevoPropietario.save();
        res.status(201).json(nuevoPropietario);
    } catch (error) {
        console.error('Error al crear propietario:', error);
        res.status(500).json({ message: 'Error al crear propietario', error: error.message });
    }
});

module.exports = router;