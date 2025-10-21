// src/components/Propiedades.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/propiedades.css'; // Reutilizamos estilos del modal

const Propiedades = ({ propietarioId }) => {
    const navigate = useNavigate();
    const [propiedades, setPropiedades] = useState([]);
    const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null); // Para mostrar una propiedad específica
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        idPropietario: '',
        direccion: '',
        numero: '',
        poblacion: '',
        cp: '',
        planta: '',
        coeficiente: ''
    });

    const [propietariosDisponibles, setPropietariosDisponibles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formError, setFormError] = useState('');

    const API_PROPIEDADES_URL = 'http://localhost:3001/api/propiedades'; // URL del backend para propiedades
    const API_PROPIETARIOS_URL = 'http://localhost:3001/api/propietarios'; // URL del backend para propietarios

    useEffect(() => {
        const fetchData = async () => {
            try {
                const propiedadesResponse = await axios.get(API_PROPIEDADES_URL);
                setPropiedades(propiedadesResponse.data);

                const propietariosResponse = await axios.get(API_PROPIETARIOS_URL);
                setPropietariosDisponibles(propietariosResponse.data);

                // Si se pasa un `propietarioId`, buscar la propiedad específica
                if (propietarioId) {
                    const propiedadResponse = await axios.get(`${API_PROPIEDADES_URL}/propietario/${propietarioId}`);
                    setPropiedadSeleccionada(propiedadResponse.data);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [propietarioId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCrear = async (e) => {
        e.preventDefault();
        setFormError('');

        try {
            await axios.post(API_PROPIEDADES_URL, formData);

            // Actualizar el listado de propiedades
            const propiedadesResponse = await axios.get(API_PROPIEDADES_URL);
            setPropiedades(propiedadesResponse.data);
            setShowModal(false);

            // Resetear el formulario
            setFormData({
                idPropietario: '',
                direccion: '',
                numero: '',
                poblacion: '',
                cp: '',
                planta: '',
                coeficiente: ''
            });
        } catch (error) {
            console.error('Error al guardar la propiedad:', error);
            const serverError = error.response?.data?.message || 'Error al guardar la propiedad.';
            setFormError(serverError);
        }
    };

    const handleEliminar = async (id) => {
        try {
            await axios.delete(`${API_PROPIEDADES_URL}/${id}`);
            const propiedadesResponse = await axios.get(API_PROPIEDADES_URL);
            setPropiedades(propiedadesResponse.data);
        } catch (error) {
            console.error('Error al eliminar la propiedad:', error);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
    }

    // Si se selecciona una propiedad específica, mostrar su información
    if (propiedadSeleccionada) {
        return (
            <div className="container mt-4">
                <h2>Información de la Propiedad</h2>
                <p><strong>Dirección:</strong> {propiedadSeleccionada.direccion}</p>
                <p><strong>Características:</strong> {propiedadSeleccionada.caracteristicas}</p>
                <p><strong>Estado:</strong> {propiedadSeleccionada.estado}</p>
                <button onClick={() => setPropiedadSeleccionada(null)} className="btn btn-secondary mt-3">Volver al listado</button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center">Vista de Propiedades</h1>

            {/* Botón para abrir modal */}
            <div className="text-center mb-4">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Registrar Nueva Propiedad
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show custom-modal" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Registrar Nueva Propiedad</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {formError && <div className="alert alert-danger">{formError}</div>}
                                <form onSubmit={handleCrear} noValidate>
                                    {/* Formulario de creación */}
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="idPropietario" className="form-label">Propietario</label>
                                            <select
                                                className="form-select"
                                                id="idPropietario"
                                                name="idPropietario"
                                                value={formData.idPropietario}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Seleccione...</option>
                                                {propietariosDisponibles.map((prop) => (
                                                    <option key={prop._id} value={prop._id}>
                                                        {prop.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="direccion" className="form-label">Dirección</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="direccion"
                                                name="direccion"
                                                value={formData.direccion}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* Más campos del formulario */}
                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-primary">💾 Guardar Propiedad</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Listado de propiedades */}
            <h2 className="mt-5">Listado de Propiedades</h2>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Propietario</th>
                    <th>Dirección</th>
                    <th>Número</th>
                    <th>Población</th>
                    <th>CP</th>
                    <th>Planta</th>
                    <th>Coeficiente</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {propiedades.map(prop => {
                    const propietario = propietariosDisponibles.find(p => p._id === prop.idPropietario);
                    const nombrePropietario = propietario ? propietario.nombre : 'Desconocido';
                    return (
                        <tr key={prop._id}>
                            <td>{nombrePropietario}</td>
                            <td>{prop.direccion}</td>
                            <td>{prop.numero}</td>
                            <td>{prop.poblacion}</td>
                            <td>{prop.cp}</td>
                            <td>{prop.planta}</td>
                            <td>{prop.coeficiente}</td>
                            <td>
                                <button className="btn btn-info btn-sm" onClick={() => setPropiedadSeleccionada(prop)}>
                                    Ver Detalles
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(prop._id)}>Eliminar</button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <button onClick={handleGoBack} className="btn btn-secondary mt-3">Volver</button>
        </div>
    );
};

export default Propiedades;
