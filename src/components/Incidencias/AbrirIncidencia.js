import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AbrirIncidencia() {
    const navigate = useNavigate();
    const { propietarioId } = useParams(); // Obtener el propietarioId desde la URL
    const [formData, setFormData] = useState({
        idIncidencia: '', // Campo único
        reportadoPor: {
            nombre: '',
            contacto: ''
        },
        ubicacionEspecifica: '',
        descripcionDetallada: '',
        gravedadImpacto: ''
    });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        // Obtener el propietario automáticamente al cargar el componente
        const fetchPropietario = async () => {
            try {
                const res = await fetch(`/api/propietarios/${propietarioId}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    setFormError(errorData.message || 'Error al obtener el propietario.');
                    return;
                }
                const propietarioData = await res.json();
                setFormData((prev) => ({
                    ...prev,
                    reportadoPor: {
                        nombre: propietarioData.nombre,
                        contacto: propietarioData.email // Usa el email como contacto predeterminado
                    }
                }));
            } catch (error) {
                console.error('Error al obtener propietario:', error);
                setFormError('Error al obtener el propietario.');
            }
        };

        fetchPropietario();
    }, [propietarioId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Si el campo pertenece a "reportadoPor", actualiza el objeto interno
        if (name === 'nombre' || name === 'contacto') {
            setFormData((prev) => ({
                ...prev,
                reportadoPor: { ...prev.reportadoPor, [name]: value }
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        try {
            const res = await fetch('/api/incidencias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Incidencia creada exitosamente');
                setFormData({
                    idIncidencia: '',
                    reportadoPor: {
                        nombre: '',
                        contacto: ''
                    },
                    ubicacionEspecifica: '',
                    descripcionDetallada: '',
                    gravedadImpacto: ''
                });
            } else {
                const errorData = await res.json();
                setFormError(errorData.message || 'Error al crear la incidencia.');
            }
        } catch (error) {
            console.error('Error al crear incidencia:', error);
            setFormError('Error al crear la incidencia.');
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Abrir Nueva Incidencia</h2>
            {formError && <div className="alert alert-danger">{formError}</div>}
            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="mb-3">
                    <label htmlFor="ubicacionEspecifica" className="form-label">Ubicación Específica</label>
                    <input
                        type="text"
                        className="form-control"
                        id="ubicacionEspecifica"
                        name="ubicacionEspecifica"
                        value={formData.ubicacionEspecifica}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="descripcionDetallada" className="form-label">Descripción Detallada</label>
                    <textarea
                        className="form-control"
                        id="descripcionDetallada"
                        name="descripcionDetallada"
                        value={formData.descripcionDetallada}
                        onChange={handleChange}
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="gravedadImpacto" className="form-label">Gravedad Impacto</label>
                    <select
                        className="form-select"
                        id="gravedadImpacto"
                        name="gravedadImpacto"
                        value={formData.gravedadImpacto}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                        <option value="Crítica">Crítica</option>
                    </select>
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">Abrir Incidencia</button>
                </div>
            </form>
            <button onClick={handleGoBack} className="btn btn-secondary mt-3">Volver</button>
        </div>
    );
}
