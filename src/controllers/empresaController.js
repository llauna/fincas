// controllers/empresaController.js
const Empresa = require('../models/Empresa');

exports.getEmpresas = async (req, res) => {
    try {
        const empresas = await Empresa.find()
            .populate('comunidades', 'nombre');
        res.json(empresas);
    } catch (error) {
        console.error('Error al obtener empresas:', error);
        res.status(500).json({ error: 'Error al obtener empresas' });
    }
};

exports.createEmpresa = async (req, res) => {
    try {
        const nuevaEmpresa = new Empresa(req.body);
        await nuevaEmpresa.save();
        const empresaConComunidades = await Empresa.findById(nuevaEmpresa._id)
            .populate('comunidades', 'nombre');
        res.status(201).json(empresaConComunidades);
    } catch (error) {
        console.error('Error al crear empresa:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateEmpresa = async (req, res) => {
    try {
        const empresaActualizada = await Empresa.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('comunidades', 'nombre');

        if (!empresaActualizada) {
            return res.status(404).json({ error: error.message });
        }

        res.json(empresaActualizada);
    } catch (error) {
        console.error('Error al actualizar empresa:', error);
        res.status(500).json({ error: 'Error al actualizar empresa' });
    }
};

exports.deleteEmpresa = async (req, res) => {
    try {
        const empresaEliminada = await Empresa.findByIdAndDelete(req.params.id);

        if (!empresaEliminada) {
            return res.status(404).json({ error: 'Empresa no encontrada' });
        }

        res.json({ mensaje: 'Empresa eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar empresa:', error);
        res.status(500).json({ error: 'Error al eliminar empresa' });
    }
};
