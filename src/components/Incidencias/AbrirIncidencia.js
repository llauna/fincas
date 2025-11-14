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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeForm = async () => {
            try {
                // Obtener el usuario logueado desde localStorage
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    setFormError('No se encontró la información del usuario. Por favor, inicie sesión nuevamente.');
                    setIsLoading(false);
                    return;
                }

                const currentUser = JSON.parse(storedUser);
                console.log('Usuario actual:', currentUser);

                if (currentUser.tipo === 'cliente') {
                    // Si es un cliente, usar sus propios datos
                    setFormData(prev => ({
                        ...prev,
                        reportadoPor: {
                            nombre: currentUser.nombre || 'Nombre no disponible',
                            contacto: currentUser.email || currentUser.telefono || 'Contacto no disponible'
                        }
                    }));
                } else if (propietarioId) {
                    // Si es un empleado, obtener los datos del propietario seleccionado
                    const res = await fetch(`/api/propietarios/${propietarioId}`);
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(errorData.message || 'Error al obtener el propietario');
                    }

                    const propietarioData = await res.json();
                    console.log('Datos del propietario:', propietarioData);

                    if (!propietarioData) {
                        throw new Error('No se recibieron datos del propietario');
                    }

                    setFormData(prev => ({
                        ...prev,
                        reportadoPor: {
                            nombre: propietarioData.nombre || 'Nombre no disponible',
                            contacto: propietarioData.email || propietarioData.telefono || 'Contacto no disponible'
                        }
                    }));
                }
            } catch (error) {
                console.error('Error al inicializar el formulario:', error);
                setFormError(error.message || 'Error al cargar los datos del formulario');
            } finally {
                setIsLoading(false);
            }
        };

        initializeForm();
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
            // Asegurarse de que los campos requeridos estén presentes
            if (!formData.reportadoPor?.nombre || !formData.reportadoPor?.contacto) {
                throw new Error('Por favor complete todos los campos requeridos');
            }

            // Crear el objeto de incidencia con la estructura exacta esperada por el servidor
            const incidenciaData = {
                reportadoPor: {
                    nombre: formData.reportadoPor.nombre,
                    contacto: formData.reportadoPor.contacto
                },
                ubicacionEspecifica: formData.ubicacionEspecifica,
                descripcionDetallada: formData.descripcionDetallada,
                gravedadImpacto: formData.gravedadImpacto
                // idIncidencia y fechaHoraReporte se generan automáticamente en el servidor
            };

            console.log('Enviando datos de incidencia:', JSON.stringify(incidenciaData, null, 2));

            const res = await fetch('http://localhost:3001/api/incidencias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(incidenciaData),
                credentials: 'include' // Importante para las cookies de autenticación
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error al crear la incidencia');
            }

            const result = await res.json();
            console.log('Incidencia creada:', result);

            alert('Incidencia creada exitosamente');

            navigate(`/incidencias/${propietarioId || ''}`);

        } catch (error) {
            console.error('Error al crear incidencia:', error);
            setFormError(error.message || 'Error al crear la incidencia. Por favor, intente de nuevo.');
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (isLoading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando datos del formulario...</p>
            </div>
        );
    }

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