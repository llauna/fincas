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

// Controlador para obtener un proveedor por su ID
exports.getProveedorById = async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (!proveedor) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el proveedor', error });
    }
};

// Crear proveedor
exports.createProveedor = async (req, res) => {
    try {
        console.log('Datos recibidos para nuevo proveedor:', req.body);
        
        // Validar campos requeridos
        const requiredFields = ['nombre', 'direccion', 'poblacion', 'cp', 'tipoServicio', 'actividad', 'telefono', 'email'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: 'Faltan campos requeridos', 
                missingFields,
                receivedData: req.body
            });
        }

        // Limpiar el NIF si está vacío o solo contiene espacios
        if (req.body.nif && req.body.nif.trim() === '') {
            delete req.body.nif;
        }

        const nuevoProveedor = new Proveedor(req.body);
        
        // Validar el documento antes de guardar
        const validationError = nuevoProveedor.validateSync();
        if (validationError) {
            console.error('Error de validación:', validationError);
            return res.status(400).json({ 
                message: 'Error de validación', 
                error: validationError,
                validationErrors: validationError.errors 
            });
        }

        await nuevoProveedor.save();
        console.log('Proveedor creado exitosamente:', nuevoProveedor);
        res.status(201).json(nuevoProveedor);
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        
        // Manejar errores de duplicación de NIF
        if (error.code === 11000) {
            if (error.keyPattern && error.keyPattern.nif) {
                return res.status(400).json({ 
                    message: 'El NIF ya está en uso',
                    field: 'nif',
                    error: 'DUPLICATE_NIF',
                    errorDetails: error
                });
            }
            return res.status(400).json({
                message: 'Error: Ya existe un registro con los mismos datos',
                error: 'DUPLICATE_ENTRY',
                errorDetails: error
            });
        }
        
        // Manejar errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            Object.keys(error.errors).forEach(key => {
                validationErrors[key] = error.errors[key].message;
            });
            return res.status(400).json({
                message: 'Error de validación',
                error: 'VALIDATION_ERROR',
                validationErrors,
                errorDetails: error
            });
        }
        
        // Otros errores
        res.status(400).json({ 
            message: 'Error al crear proveedor: ' + (error.message || 'Error desconocido'),
            error: 'SERVER_ERROR',
            errorDetails: process.env.NODE_ENV === 'development' ? error : undefined
        });
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
