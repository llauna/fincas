// routes/administradorFincas.js
const express = require('express');
const router = express.Router();
const AdministradorFincas = require('../models/AdministradorFincas');

// CREATE
router.post('/', async (req, res) => {
    try {
        const admin = new AdministradorFincas(req.body);
        await admin.save();
        res.status(201).json(admin);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ ALL
router.get('/', async (req, res) => {
    try {
        const admins = await AdministradorFincas.find();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ ONE
router.get('/:id', async (req, res) => {
    try {
        const admin = await AdministradorFincas.findById(req.params.id);
        if (!admin) return res.status(404).json({ error: 'No encontrado' });
        res.json(admin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const admin = await AdministradorFincas.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!admin) return res.status(404).json({ error: 'No encontrado' });
        res.json(admin);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const admin = await AdministradorFincas.findByIdAndDelete(req.params.id);
        if (!admin) return res.status(404).json({ error: 'No encontrado' });
        res.json({ message: 'Eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
