// routes/empresas.js
const express = require('express');
const router = express.Router();
const Empresa = require('../models/AdministradorFincas'); // Ajusta la ruta a tu modelo

// Obtener todas las empresas
router.get('/', async (req, res) => {
    try {
        const empresas = await Empresa.find().populate('comunidades');
        res.json(empresas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener empresas' });
    }
});

// Crear nueva empresa
router.post('/', async (req, res) => {
    try {
        const nuevaEmpresa = new Empresa(req.body);
        await nuevaEmpresa.save();
        res.status(201).json(nuevaEmpresa);
    } catch (error) {
        res.status(400).json({ error: 'Error al guardar empresa' });
    }
});

// Eliminar empresa por ID
router.delete('/:id', async (req, res) => {
    try {
        await Empresa.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Empresa eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar empresa' });
    }
});

module.exports = router;
