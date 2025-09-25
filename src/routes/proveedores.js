// src/routes/proveedores.js
const express = require('express');
const router = express.Router();
const Proveedor = require('../models/Proveedor');

// Obtener todos los proveedores
router.get('/', async (req, res) => {
    try {
        const proveedores = await Proveedor.find();
        res.status(200).json(proveedores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener proveedores', error });
    }
});

// Crear un nuevo proveedor
router.post('/', async (req, res) => {
    try {
        const nuevoProveedor = new Proveedor(req.body);
        const proveedorGuardado = await nuevoProveedor.save();
        res.status(201).json(proveedorGuardado);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear proveedor', err });
    }
});

// Actualizar un proveedor por ID
router.put('/:id', async (req, res) => {
    try {
        const proveedorActualizado = await Proveedor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!proveedorActualizado) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.json(proveedorActualizado);
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar proveedor', err });
    }
});

// Eliminar un proveedor por ID
router.delete('/:id', async (req, res) => {
    try {
        const proveedorEliminado = await Proveedor.findByIdAndDelete(req.params.id);
        if (!proveedorEliminado) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.json({ message: 'Proveedor eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar proveedor', err });
    }
});

module.exports = router;