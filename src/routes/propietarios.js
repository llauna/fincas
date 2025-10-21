//routes/propietarios.js
const express = require('express');
const router = express.Router();
const Propietario = require('../models/Propietario');
const Propiedad = require('../models/Propiedad');
const Incidencia = require('../models/Incidencias');
const Movimiento = require('../models/Movimiento');
const Comunidad = require('../models/Comunidad'); // Modelo de comunidad
const jwt = require('jsonwebtoken');

// -------------------- Middleware para verificar token --------------------
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

// -------------------- RUTAS DE PROPIETARIOS --------------------

// Obtener todos los propietarios (protegido con token)
router.get('/', verificarToken, async (req, res) => {
    try {
        if (req.user.tipo !== 'empleado') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        const propietarios = await Propietario.find();
        res.status(200).json(propietarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener propietarios', error });
    }
});

// Obtener un propietario por ID
router.get('/:propietarioId', verificarToken, async (req, res) => {
    try {
        const propietario = await Propietario.findById(req.params.propietarioId);
        if (!propietario) {
            return res.status(404).json({ message: 'Propietario no encontrado.' });
        }
        res.json(propietario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el propietario.', error });
    }
});

// Crear un nuevo propietario
router.post('/', verificarToken, async (req, res) => {
    try {
        const nuevoPropietario = new Propietario(req.body);
        await nuevoPropietario.save();
        res.status(201).json(nuevoPropietario);
    } catch (error) {
        console.error('Error al crear propietario:', error);
        res.status(500).json({ message: 'Error al crear propietario', error: error.message });
    }
});

// Actualizar un propietario por ID
router.put('/:id', verificarToken, async (req, res) => {
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
router.delete('/:id', verificarToken, async (req, res) => {
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

// Unir propietario a una comunidad
router.post('/:idPropietario/unir-comunidad/:idComunidad', verificarToken, async (req, res) => {
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

// -------------------- RUTAS DE PROPIEDADES --------------------

// Obtener información de la propiedad del propietario
router.get('/propiedad/:propietarioId', verificarToken, async (req, res) => {
    try {
        const propiedad = await Propiedad.findOne({ propietario: req.params.propietarioId });
        if (!propiedad) {
            return res.status(404).json({ message: 'Propiedad no encontrada' });
        }
        res.status(200).json(propiedad);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la propiedad', error });
    }
});

// -------------------- RUTAS DE INCIDENCIAS --------------------

// Obtener incidencias relacionadas con la propiedad
router.get('/incidencias/:propietarioId', verificarToken, async (req, res) => {
    try {
        const incidencias = await Incidencia.find({ propietario: req.params.propietarioId });
        res.status(200).json(incidencias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las incidencias', error });
    }
});

// Crear una nueva incidencia
router.post('/incidencias', verificarToken, async (req, res) => {
    try {
        const nuevaIncidencia = new Incidencia(req.body);
        const savedIncidencia = await nuevaIncidencia.save();
        res.status(201).json(savedIncidencia);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la incidencia', error });
    }
});

// -------------------- RUTAS DE MOVIMIENTOS FINANCIEROS --------------------

// Obtener movimientos financieros relacionados con la propiedad
router.get('/movimientos/:propietarioId', verificarToken, async (req, res) => {
    try {
        const movimientos = await Movimiento.find({ propietario: req.params.propietarioId });
        res.status(200).json(movimientos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los movimientos', error });
    }
});

module.exports = router;

