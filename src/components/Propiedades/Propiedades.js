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

    const API_PROPIEDADES_URL = 'http://localhost:3001/api/propiedades';
    const API_PROPIETARIOS_URL = 'http://localhost:3001/api/propietarios';

    // Paginación y ordenación
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [itemsPerPage] = useState(5); // Número de elementos por página
    const [sortConfig, setSortConfig] = useState({ key: 'direccion', direction: 'asc' }); // Configuración de ordenación

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

    // Ordenar propiedades
    const sortedPropiedades = [...propiedades].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Obtener propiedades de la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedPropiedades.slice(indexOfFirstItem, indexOfLastItem);

    // Cambiar página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Cambiar ordenación
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
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
                                                <option value="">Seleccione un propietario</option>
                                                {propietariosDisponibles.map((prop) => (
                                                    <option key={prop._id} value={prop._id}>
                                                        {prop.nombre} {prop.apellidos || ''}
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
                                                placeholder="Calle/Avenida/Plaza..."
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="numero" className="form-label">Número</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="numero"
                                                name="numero"
                                                value={formData.numero}
                                                onChange={handleChange}
                                                required
                                                placeholder="Número"
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="poblacion" className="form-label">Población</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="poblacion"
                                                name="poblacion"
                                                value={formData.poblacion}
                                                onChange={handleChange}
                                                required
                                                placeholder="Ciudad/Pueblo"
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="cp" className="form-label">Código Postal</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="cp"
                                                name="cp"
                                                value={formData.cp}
                                                onChange={handleChange}
                                                required
                                                pattern="[0-9]{5}"
                                                title="El código postal debe tener 5 dígitos"
                                                placeholder="12345"
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="planta" className="form-label">Planta</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="planta"
                                                name="planta"
                                                value={formData.planta}
                                                onChange={handleChange}
                                                required
                                                placeholder="Ej: 1ºA, Bajo, Ático..."
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="coeficiente" className="form-label">Coeficiente</label>
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="1"
                                                    className="form-control"
                                                    id="coeficiente"
                                                    name="coeficiente"
                                                    value={formData.coeficiente}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="0.00"
                                                />
                                                <span className="input-group-text">%</span>
                                            </div>
                                            <div className="form-text">Valor entre 0 y 1 (ej: 0.25 para 25%)</div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between mt-4">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            💾 Guardar Propiedad
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Listado de propiedades con ordenación */}
            <h2 className="mt-5">Listado de Propiedades</h2>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th onClick={() => handleSort('idPropietario')} style={{ cursor: 'pointer' }}>
                        Propietario {sortConfig.key === 'idPropietario' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                    </th>
                    <th onClick={() => handleSort('direccion')} style={{ cursor: 'pointer' }}>
                        Dirección {sortConfig.key === 'direccion' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                    </th>
                    <th onClick={() => handleSort('numero')} style={{ cursor: 'pointer' }}>
                        Número {sortConfig.key === 'numero' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                    </th>
                    <th onClick={() => handleSort('poblacion')} style={{ cursor: 'pointer' }}>
                        Población {sortConfig.key === 'poblacion' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                    </th>
                    <th onClick={() => handleSort('cp')} style={{ cursor: 'pointer' }}>
                        CP {sortConfig.key === 'cp' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                    </th>
                    <th onClick={() => handleSort('planta')} style={{ cursor: 'pointer' }}>
                        Planta {sortConfig.key === 'planta' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                    </th>
                    <th onClick={() => handleSort('coeficiente')} style={{ cursor: 'pointer' }}>
                        Coeficiente {sortConfig.key === 'coeficiente' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                    </th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map(prop => {
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

            {/* Paginación */}
            <div className="pagination">
                {Array.from({ length: Math.ceil(propiedades.length / itemsPerPage) }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'} mx-1`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            <button onClick={handleGoBack} className="btn btn-secondary mt-3">Volver</button>
        </div>
    );
};

export default Propiedades;

