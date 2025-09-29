// src/routes/bancos.js
const express = require('express');
const router = express.Router();
const Banco = require('../models/Banco');

// Obtener todos los bancos
router.get('/', async (req, res) => {
    try {
        const bancos = await Banco.find();
        res.status(200).json(bancos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener bancos', error });
    }
});

// Crear un nuevo banco
router.post('/', async (req, res) => {
    try {
        const nuevoBanco = new Banco(req.body);
        const bancoGuardado = await nuevoBanco.save();
        res.status(201).json(bancoGuardado);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el Banco', err });
    }
});

// Actualizar un banco por ID
router.put('/:id', async (req, res) => {
    try {
        const bancoActualizado = await Banco.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!bancoActualizado) {
            return res.status(404).json({ message: 'Banco no encontrado' });
        }
        res.json(bancoActualizado);
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar banco', err });
    }
});

// Eliminar un banco por ID
router.delete('/:id', async (req, res) => {
    try {
        const bancoEliminado = await Banco.findByIdAndDelete(req.params.id);
        if (!bancoEliminado) {
            return res.status(404).json({ message: 'Banco no encontrado' });
        }
        res.json({ message: 'Banco eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar banco', err });
    }
});

module.exports = router;