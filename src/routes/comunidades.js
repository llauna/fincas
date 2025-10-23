// routes/comunidades.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth'); // Middleware de autenticación
const { getComunidades } = require('../controllers/propietarioController');
const Comunidad = require('../models/Comunidad');

// ✅ GET - Listar comunidades
router.get('/', verificarToken, async (req, res) => {
    try {
        const comunidades = await Comunidad.find(); // Ejemplo con Mongoose
        res.json(comunidades);
    } catch (error) {
        console.error('Error al obtener comunidades:', error);
        res.status(500).json({ message: 'Error al obtener comunidades' });
    }
});

// ✅ POST - Crear comunidad
router.post('/', verificarToken, async (req, res) => {
    try {
        const nuevaComunidad = new Comunidad(req.body);
        await nuevaComunidad.save();
        res.status(201).json(nuevaComunidad);
    } catch (error) {
        console.error('Error al crear comunidad:', error);
        res.status(500).json({ message: 'Error al crear comunidad' });
    }
});

// ✅ PUT - Actualizar comunidad
router.put('/:id', verificarToken, async (req, res) => {
    try {
        const comunidadActualizada = await Comunidad.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(comunidadActualizada);
    } catch (error) {
        console.error('Error al actualizar comunidad:', error);
        res.status(500).json({ message: 'Error al actualizar comunidad' });
    }
});

// ✅ DELETE - Eliminar comunidad
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        await Comunidad.findByIdAndDelete(req.params.id);
        res.json({ message: 'Comunidad eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar comunidad:', error);
        res.status(500).json({ message: 'Error al eliminar comunidad' });
    }
});


router.get('/api/comunidades', getComunidades);

module.exports = router;
