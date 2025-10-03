// src/routes/caja.js
const express = require('express');
const router = express.Router();
const Caja = require('../models/Caja');

// ✅ Obtener saldos agrupados por comunidad (ruta específica)
router.get('/saldos', async (req, res) => {
    try {
        const saldos = await Caja.aggregate([
            {
                $addFields: {
                    comunidadIdObj: {
                        $cond: [
                            { $eq: [{ $type: "$comunidadId" }, "string"] },
                            { $toObjectId: "$comunidadId" },
                            "$comunidadId"
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$comunidadIdObj",
                    saldo: {
                        $sum: {
                            $cond: [
                                { $eq: ["$tipo", "Ingreso"] },
                                "$importe",
                                { $multiply: ["$importe", -1] }
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "comunidads", // nombre real de la colección
                    localField: "_id",
                    foreignField: "_id",
                    as: "comunidad"
                }
            },
            { $unwind: "$comunidad" },
            {
                $project: {
                    _id: 0,
                    comunidadId: "$_id",
                    comunidadNombre: "$comunidad.nombre",
                    saldo: 1
                }
            }
        ]);
        res.json(saldos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener saldos agrupados', error });
    }
});

// Obtener todos los movimientos con nombre de comunidad
router.get('/global', async (req, res) => {
    try {
        // 1. Consulta y población
        const movimientos = await Caja.find({})
            .populate('comunidadId', 'nombre')
            .sort({ fecha: 1, createdAt: 1 });

        // 2. Mapeo para formatear la respuesta y manejar errores de datos
        const movimientosFormateados = movimientos.map(mov => {

            // Si comunidadId se pobló y tiene nombre
            const nombreComunidad = mov.comunidadId && mov.comunidadId.nombre
                ? mov.comunidadId.nombre
                : '¡ERROR DE DATOS! ID: ' + (mov.comunidadId ? mov.comunidadId : 'N/A');

            return {
                _id: mov._id,
                fecha: mov.fecha,
                concepto: mov.concepto,
                importe: parseFloat(mov.importe),
                tipo: mov.tipo,
                comunidadNombre: nombreComunidad,
                // Puedes comentar o dejar esta línea:
                // comunidadIdOriginal: mov.comunidadId ? mov.comunidadId._id : mov.comunidadId,
            };
        });

        res.json(movimientosFormateados);

    } catch (error) {
        console.error('❌ Error al obtener movimientos globales en backend:', error);
        // Devuelve un 500 para diagnosticar el fallo en el frontend
        res.status(500).json({ message: 'Error interno del servidor al obtener movimientos globales.', error: error.message });
    }
});

// ✅ Obtener caja global (saldo total + todos los movimientos)
router.get('/caja-global', async (req, res) => {
    try {
        // 1. Obtener todos los movimientos y poblar el nombre de la comunidad
        const movimientos = await Caja.find({})
            .populate('comunidadId', 'nombre')
            .sort({ fecha: 1, createdAt: 1 });

        // 2. Calcular saldo total
        const saldoTotal = movimientos.reduce((acc, mov) => {
            return mov.tipo === 'Ingreso'
                ? acc + parseFloat(mov.importe)
                : acc - parseFloat(mov.importe);
        }, 0);

        // 3. Formatear movimientos para enviar al cliente
        const movimientosFormateados = movimientos.map(mov => ({
            _id: mov._id,
            fecha: mov.fecha,
            concepto: mov.concepto,
            importe: parseFloat(mov.importe),
            tipo: mov.tipo,
            comunidadNombre: mov.comunidadId?.nombre || 'N/A'
        }));

        // 4. Responder con saldo total y movimientos
        res.json({
            saldoTotal,
            movimientos: movimientosFormateados
        });

    } catch (error) {
        console.error('❌ Error al obtener caja global:', error);
        res.status(500).json({
            message: 'Error interno del servidor al obtener caja global.',
            error: error.message
        });
    }
});


// ✅ Obtener movimientos de una comunidad específica (ruta específica)
router.get('/comunidad/:comunidadId', async (req, res) => {
    try {
        const movimientos = await Caja.find({ comunidadId: req.params.comunidadId });
        res.json(movimientos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener movimientos', error });
    }
});

// Obtener todas las cajas
router.get('/', async (req, res) => {
    try {
        const cajas = await Caja.find();
        res.status(200).json(cajas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener cajas', error });
    }
});

// Obtener una caja por ID (ruta genérica, va al final)
router.get('/:cajaId', async (req, res) => {
    try {
        console.log("📌 ID recibido en backend:", req.params.cajaId);
        const caja = await Caja.findById(req.params.cajaId);
        if (!caja) return res.status(404).json({ message: 'Caja no encontrada' });
        res.json(caja);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la caja' });
    }
});

// Crear una nueva caja
router.post('/', async (req, res) => {
    try {
        const nuevaCaja = new Caja(req.body);
        const cajaGuardada = await nuevaCaja.save();
        res.status(201).json(cajaGuardada);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear la caja', err });
    }
});

// Actualizar una caja por ID
router.put('/:id', async (req, res) => {
    try {
        const cajaActualizada = await Caja.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cajaActualizada) {
            return res.status(404).json({ message: 'Caja no encontrada' });
        }
        res.json(cajaActualizada);
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar caja', err });
    }
});

// Eliminar una caja por ID
router.delete('/:id', async (req, res) => {
    try {
        const cajaEliminada = await Caja.findByIdAndDelete(req.params.id);
        if (!cajaEliminada) {
            return res.status(404).json({ message: 'Caja no encontrada' });
        }
        res.json({ message: 'Caja eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar caja', err });
    }
});

module.exports = router;
