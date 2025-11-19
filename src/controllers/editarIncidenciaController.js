// src/controllers/editarIncidenciaController.js
import { useState, useEffect } from 'react';
import { obtenerIncidenciaPorId, actualizarIncidencia } from '../services/editarIncidenciaService';

export function useEditarIncidenciaController(id, navigate) {
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
        if (id) {
            setLoading(true);
            obtenerIncidenciaPorId(id)
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await actualizarIncidencia(id, formData);
            setSuccess('Incidencia actualizada correctamente');
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
