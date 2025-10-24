//controllers/propietarioController.js
const Empresa = require('../models/Empresa'); // Importa el modelo Empresa
const Comunidad = require('../models/Comunidad'); // Importa el modelo Comunidad
const Propietario = require('../models/Propietario'); // Importa el modelo de Propietario

// Obtener todos los propietarios
exports.getPropietarios = async (req, res) => {
    try {
        const propietarios = await Propietario.find().populate('gestorFinca comunidades');
        res.status(200).json(propietarios);
    } catch (error) {
        console.error('Error al obtener propietarios:', error);
        res.status(500).json({ message: 'Error al obtener propietarios', error });
    }
};

// Crear un nuevo propietario con validación de gestorFinca y comunidades
exports.createPropietario = async (req, res) => {
    try {
        console.log('Datos recibidos para crear propietario:', req.body);

        const { nombre, email, telefono, gestorFincaId, comunidadesIds } = req.body;

        // Validar que el gestor de finca existe
        const gestorFinca = await Empresa.findById(gestorFincaId);
        if (!gestorFinca) {
            return res.status(400).json({ message: 'El gestor de finca no existe' });
        }

        // Validar que las comunidades existen
        const comunidades = await Comunidad.find({ _id: { $in: comunidadesIds } });
        if (comunidades.length !== comunidadesIds.length) {
            return res.status(400).json({ message: 'Una o más comunidades no existen' });
        }

        // Crear el propietario con las referencias correctas
        const propietario = new Propietario({
            nombre,
            email,
            telefono,
            gestorFinca: gestorFincaId,
            comunidades: comunidadesIds
        });

        await propietario.save();

        // Devolver el propietario con populate
        const propietarioCreado = await Propietario.findById(propietario._id)
            .populate('gestorFinca comunidades');

        console.log('Propietario creado:', propietarioCreado);
        res.status(201).json(propietarioCreado);

    } catch (error) {
        console.error('Error al crear propietario:', error);
        res.status(500).json({ message: 'Error al crear propietario', error });
    }
};


// Otros métodos del controlador
exports.updatePropietario = async (req, res) => {
    try {
        const propietario = await Propietario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('gestorFinca comunidades');

        if (!propietario) {
            return res.status(404).json({ message: 'Propietario no encontrado' });
        }

        res.status(200).json(propietario);
    } catch (error) {
        console.error('Error al actualizar propietario:', error);
        res.status(500).json({ message: 'Error al actualizar propietario', error });
    }
};

exports.deletePropietario = async (id) => {
    try {
        await Propietario.findByIdAndDelete(id);
    } catch (error) {
        console.error('Error al eliminar propietario:', error);
        throw error;
    }
};

exports.getPropietarioById = async (req, res) => {
    try {
        const propietario = await Propietario.findById(req.params.id)
            .populate('gestorFinca comunidades');

        if (!propietario) {
            return res.status(404).json({ message: 'Propietario no encontrado' });
        }
        res.status(200).json(propietario);
    } catch (error) {
        console.error('Error al obtener propietario por ID:', error);
        res.status(500).json({ message: 'Error al obtener propietario', error });
    }
};

exports.getEmpresas = async (req, res) => {
    try {
        const empresas = await Empresa.find();
        res.status(200).json(empresas);
    } catch (error) {
        console.error('Error al obtener empresas:', error);
        res.status(500).json({ message: 'Error al obtener empresas', error });
    }
};

exports.getComunidades = async (req, res) => {
    try {
        const comunidades = await Comunidad.find();
        res.status(200).json(comunidades);
    } catch (error) {
        console.error('Error al obtener comunidades:', error);
        res.status(500).json({ message: 'Error al obtener comunidades', error });
    }
};
