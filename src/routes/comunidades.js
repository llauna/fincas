const express = require('express');
const router = express.Router();
const Comunidad = require('../models/Comunidad');
const jwt = require('jsonwebtoken');

// Middleware para verificar token
function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token requerido' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}

// 🔹 Ruta para empleados
router.get('/', verificarToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'empleado') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        const comunidades = await Comunidad.find();
        res.json(comunidades);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener comunidades' });
    }
});

// 🔹 Ruta para clientes
router.get('/mis-comunidades', verificarToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'cliente') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        const comunidades = await Comunidad.find({
            $or: [
                { propietarios: req.user.id },
                { arrendatarios: req.user.id }
            ]
        });
        res.json(comunidades);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener comunidades del cliente' });
    }
});

// Crear comunidad con validación de duplicados
router.post('/', verificarToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'empleado') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        const { nombre, direccion, cp } = req.body;

        const existe = await Comunidad.findOne({
            nombre: nombre.trim(),
            direccion: direccion.trim(),
            cp: cp.trim()
        });

        if (existe) {
            return res.status(400).json({ message: '❌ Esta comunidad ya está registrada.' });
        }

        const nuevaComunidad = new Comunidad(req.body);
        await nuevaComunidad.save();
        res.status(201).json(nuevaComunidad);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear comunidad', error });
    }
});

// Editar comunidad
router.put('/:id', verificarToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'empleado') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        const comunidadActualizada = await Comunidad.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(comunidadActualizada);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar comunidad', error });
    }
});

// Eliminar comunidad
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'empleado') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        await Comunidad.findByIdAndDelete(req.params.id);
        res.json({ message: 'Comunidad eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar comunidad', error });
    }
});

module.exports = router;
