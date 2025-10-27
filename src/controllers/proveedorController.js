// controllers/proveedorController.js
const Proveedor = require('../models/Proveedor');

// Obtener todos los proveedores
exports.getProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.find();
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener proveedores', error });
    }
};

// Crear proveedor
exports.createProveedor = async (req, res) => {
    try {
        const nuevoProveedor = new Proveedor(req.body);
        await nuevoProveedor.save();
        res.status(201).json(nuevoProveedor);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear proveedor', error });
    }
};

// Eliminar proveedor
exports.deleteProveedor = async (req, res) => {
    try {
        await Proveedor.findByIdAndDelete(req.params.id);
        res.json({ message: 'Proveedor eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar proveedor', error });
    }
};

// Añadir factura
exports.addFactura = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });

        proveedor.facturas.push(req.body);
        await proveedor.save();
        res.json(proveedor);
    } catch (error) {
        res.status(400).json({ message: 'Error al añadir factura', error });
    }
};

// Añadir trabajo
exports.addTrabajo = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });

        proveedor.trabajos.push(req.body);
        await proveedor.save();
        res.json(proveedor);
    } catch (error) {
        res.status(400).json({ message: 'Error al añadir trabajo', error });
    }
};

// Eliminar factura
exports.deleteFactura = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });

        proveedor.facturas = proveedor.facturas.filter(f => f._id.toString() !== req.params.facturaId);
        await proveedor.save();
        res.json(proveedor);
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar factura', error });
    }
};

// Eliminar trabajo
exports.deleteTrabajo = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });

        proveedor.trabajos = proveedor.trabajos.filter(t => t._id.toString() !== req.params.trabajoId);
        await proveedor.save();
        res.json(proveedor);
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar trabajo', error });
    }
};
