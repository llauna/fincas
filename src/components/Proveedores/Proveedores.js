// src/components/Proveedores.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/propiedades.css'; // Reutilizamos estilos

const Proveedores = () => {
    const navigate = useNavigate();
    const [proveedores, setProveedores] = useState([]);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formError, setFormError] = useState('');

    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        poblacion: '',
        cp: '',
        tipoServicio: '',
        actividad: '',
        telefono: '',
        email: '',
        facturas: [],
        trabajos: []
    });

    const API_PROVEEDORES_URL = 'http://localhost:3001/api/proveedores';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(API_PROVEEDORES_URL);
                setProveedores(res.data);
            } catch (error) {
                console.error('Error al obtener proveedores:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleCrear = async (e) => {
        e.preventDefault();
        setFormError('');
        setSuccessMessage('');
        setIsSubmitting(true);

        // Validación de campos requeridos
        const requiredFields = ['nombre', 'direccion', 'poblacion', 'cp', 'tipoServicio', 'actividad', 'telefono', 'email'];
        const missingFields = requiredFields.filter(field => !formData[field].trim());
        
        if (missingFields.length > 0) {
            setFormError(`Por favor complete los campos obligatorios: ${missingFields.join(', ')}`);
            setIsSubmitting(false);
            return;
        }

        try {
            console.log('Enviando datos del proveedor:', formData);
            const response = await axios.post(API_PROVEEDORES_URL, formData);
            console.log('Respuesta del servidor:', response.data);
            
            // Actualizar la lista de proveedores
            const res = await axios.get(API_PROVEEDORES_URL);
            setProveedores(res.data);
            
            // Mostrar mensaje de éxito y limpiar el formulario
            setSuccessMessage('✅ Proveedor registrado correctamente');
            setFormData({
                nombre: '',
                direccion: '',
                poblacion: '',
                cp: '',
                tipoServicio: '',
                actividad: '',
                telefono: '',
                email: '',
                facturas: [],
                trabajos: []
            });

            // Ocultar el mensaje después de 3 segundos
            setTimeout(() => {
                setSuccessMessage('');
                setShowModal(false);
            }, 2000);

        } catch (error) {
            console.error('Error al guardar proveedor:', error);
            let errorMessage = 'Error al guardar el proveedor';
            
            if (error.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                console.error('Datos del error:', error.response.data);
                errorMessage = error.response.data.message || error.response.data.error || errorMessage;
                
                // Manejar errores de validación específicos
                if (error.response.data.errors) {
                    const validationErrors = Object.values(error.response.data.errors)
                        .map(err => err.message || err.msg)
                        .join('. ');
                    if (validationErrors) errorMessage = validationErrors;
                }
            } else if (error.request) {
                // La solicitud fue hecha pero no se recibió respuesta
                console.error('No se recibió respuesta del servidor');
                errorMessage = 'No se pudo conectar con el servidor. Por favor, intente nuevamente.';
            } else {
                // Error al configurar la solicitud
                console.error('Error al configurar la solicitud:', error.message);
                errorMessage = `Error: ${error.message}`;
            }
            
            setFormError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEliminar = async (id) => {
        try {
            await axios.delete(`${API_PROVEEDORES_URL}/${id}`);
            const res = await axios.get(API_PROVEEDORES_URL);
            setProveedores(res.data);
        } catch (error) {
            console.error('Error al eliminar proveedor:', error);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
    }

    if (proveedorSeleccionado) {
        return (
            <div className="container mt-4">
                <h2>Información del Proveedor</h2>
                <p><strong>Nombre:</strong> {proveedorSeleccionado.nombre}</p>
                <p><strong>Actividad:</strong> {proveedorSeleccionado.actividad}</p>
                <p><strong>Teléfono:</strong> {proveedorSeleccionado.telefono}</p>
                <p><strong>Email:</strong> {proveedorSeleccionado.email}</p>
                <p><strong>Dirección:</strong> {proveedorSeleccionado.direccion}, {proveedorSeleccionado.poblacion} ({proveedorSeleccionado.cp})</p>
                <p><strong>Tipo de Servicio:</strong> {proveedorSeleccionado.tipoServicio}</p>

                <h4>Facturas</h4>
                <ul>
                    {proveedorSeleccionado.facturas?.map((f, idx) => (
                        <li key={idx}>{f.numero} - {f.importe}€ - {new Date(f.fecha).toLocaleDateString()}</li>
                    ))}
                </ul>

                <h4>Trabajos</h4>
                <ul>
                    {proveedorSeleccionado.trabajos?.map((t, idx) => (
                        <li key={idx}>{t.descripcion} ({t.estado})</li>
                    ))}
                </ul>

                <button onClick={() => setProveedorSeleccionado(null)} className="btn btn-secondary mt-3">Volver al listado</button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center">Vista de Proveedores</h1>

            <div className="text-center mb-4">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Registrar Nuevo Proveedor
                </button>
            </div>

            {showModal && (
                <div className="modal fade show custom-modal" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Registrar Nuevo Proveedor</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {formError && <div className="alert alert-danger">{formError}</div>}
                                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                                
                                <form onSubmit={handleCrear} noValidate>
                                    <fieldset disabled={isSubmitting}>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Nombre <span className="text-danger">*</span></label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    name="nombre" 
                                                    value={formData.nombre} 
                                                    onChange={handleChange} 
                                                    required 
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Actividad <span className="text-danger">*</span></label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    name="actividad" 
                                                    value={formData.actividad} 
                                                    onChange={handleChange} 
                                                    required 
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Teléfono <span className="text-danger">*</span></label>
                                                <input 
                                                    type="tel" 
                                                    className="form-control" 
                                                    name="telefono" 
                                                    value={formData.telefono} 
                                                    onChange={handleChange} 
                                                    required 
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Email <span className="text-danger">*</span></label>
                                                <input 
                                                    type="email" 
                                                    className="form-control" 
                                                    name="email" 
                                                    value={formData.email} 
                                                    onChange={handleChange} 
                                                    required 
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Dirección <span className="text-danger">*</span></label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    name="direccion" 
                                                    value={formData.direccion} 
                                                    onChange={handleChange} 
                                                    required 
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">Población <span className="text-danger">*</span></label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    name="poblacion" 
                                                    value={formData.poblacion} 
                                                    onChange={handleChange} 
                                                    required 
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">CP <span className="text-danger">*</span></label>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    name="cp" 
                                                    value={formData.cp} 
                                                    onChange={handleChange} 
                                                    required 
                                                    pattern="[0-9]{5}"
                                                    title="El código postal debe tener 5 dígitos"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Tipo de Servicio <span className="text-danger">*</span></label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="tipoServicio" 
                                                value={formData.tipoServicio} 
                                                onChange={handleChange} 
                                                required 
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div className="d-flex justify-content-between mt-4">
                                            <button 
                                                type="button" 
                                                className="btn btn-secondary" 
                                                onClick={() => setShowModal(false)}
                                                disabled={isSubmitting}
                                            >
                                                Cancelar
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Guardando...
                                                    </>
                                                ) : (
                                                    '💾 Guardar Proveedor'
                                                )}
                                            </button>
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="mt-5">Listado de Proveedores</h2>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Actividad</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Tipo Servicio</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {proveedores.map(prov => (
                    <tr key={prov._id}>
                        <td>{prov.nombre}</td>
                        <td>{prov.actividad}</td>
                        <td>{prov.telefono}</td>
                        <td>{prov.email}</td>
                        <td>{prov.tipoServicio}</td>
                        <td>
                            <button className="btn btn-info btn-sm" onClick={() => setProveedorSeleccionado(prov)}>Ver Detalles</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(prov._id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button onClick={handleGoBack} className="btn btn-secondary mt-3">Volver</button>
        </div>
    );
};

export default Proveedores;
