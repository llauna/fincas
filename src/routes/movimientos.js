const express = require('express');
const router = express.Router();
const Movimiento = require('../models/Movimiento');


// Obtener movimientos por bancoId
router.get('/:bancoId', async (req, res) => {
    try {
        const movimientos = await Movimiento.find({ banco: req.params.bancoId });
        res.json(movimientos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener movimientos' });
    }
});

module.exports = router;
