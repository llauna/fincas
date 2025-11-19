// src/controllers/abrirIncidenciaController.js
import { useState, useEffect } from 'react';
import { obtenerIncidencia, crearIncidencia, actualizarIncidencia } from '../services/abrirIncidenciaService';

export function useAbrirIncidenciaController(id, navigate) {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcionDetallada: '',
        estado: 'pendiente',
        gravedadImpacto: 'baja'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (id && id !== 'nuevo') {
            setLoading(true);
            obtenerIncidencia(id)
                .then(data => {
                    setFormData({
                        titulo: data.titulo || '',
                        descripcionDetallada: data.descripcionDetallada || '',
                        estado: data.estado || 'pendiente',
                        gravedadImpacto: data.gravedadImpacto || 'baja'
                    });
                })
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 🔹 Validaciones antes de enviar
    const validarFormulario = () => {
        if (!formData.titulo || formData.titulo.trim().length < 5) {
            return 'El título debe tener al menos 5 caracteres.';
        }
        if (!formData.descripcionDetallada || formData.descripcionDetallada.trim().length < 10) {
            return 'La descripción debe tener al menos 10 caracteres.';
        }
        const estadosValidos = ['pendiente', 'en progreso', 'resuelta', 'rechazada'];
        if (!estadosValidos.includes(formData.estado.toLowerCase())) {
            return 'El estado seleccionado no es válido.';
        }
        const gravedadValida = ['baja', 'media', 'alta'];
        if (!gravedadValida.includes(formData.gravedadImpacto.toLowerCase())) {
            return 'La gravedad seleccionada no es válida.';
        }
        return null; // ✅ Sin errores
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // 🔹 Ejecutar validaciones
        const errorValidacion = validarFormulario();
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        setLoading(true);
        try {
            if (id && id !== 'nuevo') {
                await actualizarIncidencia(id, formData);
                setSuccess('Incidencia actualizada correctamente');
            } else {
                await crearIncidencia(formData);
                setSuccess('Incidencia creada correctamente');
            }
            setTimeout(() => navigate('/incidencias'), 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        handleChange,
        handleSubmit,
        loading,
        error,
        success
    };
}
