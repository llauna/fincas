// routes/provedores.js
const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

router.get('/', proveedorController.getProveedores);
router.post('/', proveedorController.createProveedor);
router.delete('/:id', proveedorController.deleteProveedor);
// Ruta para obtener un proveedor por su ID
router.get('/:id', proveedorController.getProveedorById);


// Facturas
router.post('/:id/facturas', proveedorController.addFactura);
router.delete('/:id/facturas/:facturaId', proveedorController.deleteFactura);

// Trabajos
router.post('/:id/trabajos', proveedorController.addTrabajo);
router.delete('/:id/trabajos/:trabajoId', proveedorController.deleteTrabajo);

module.exports = router;
