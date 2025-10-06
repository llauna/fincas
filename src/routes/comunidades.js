// src/routes/comunidades.js
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
        req.user = decoded; // { id, tipo, rol }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
}

// 🔹 Ruta para empleados: todas las comunidades
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

// 🔹 Ruta para clientes: solo sus comunidades
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

module.exports = router;

