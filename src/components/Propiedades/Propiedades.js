// src/components/Propiedades.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/propiedades.css'; // Reutilizamos estilos del modal

const Propiedades = () => {
    const navigate = useNavigate();
    const [propiedades, setPropiedades] = useState([]);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const propiedadesResponse = await axios.get(API_PROPIEDADES_URL);
                setPropiedades(propiedadesResponse.data);

                const propietariosResponse = await axios.get(API_PROPIETARIOS_URL);
                setPropietariosDisponibles(propietariosResponse.data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCrear = async (e) => {
        e.preventDefault(); // 🚀 Evita recarga de página
        setFormError('');

        // 1. Normalizar los campos clave para la verificación (evitar problemas de mayúsculas/minúsculas o espacios)
        const camposClave = {
            direccion: formData.direccion.trim().toLowerCase(),
            numero: formData.numero.trim().toLowerCase(),
            cp: formData.cp.trim(),
        };

        // 🔑 2. Verificar si la propiedad ya existe en la lista local 'propiedades'
        const yaExiste = propiedades.some(prop =>
            // Comparamos los campos normalizados del formulario con los de la lista existente
            prop.direccion.toLowerCase() === camposClave.direccion &&
            prop.numero.toLowerCase() === camposClave.numero &&
            prop.cp === camposClave.cp &&
            // 🔑 Incluir la Planta en la verificación de unicidad
            prop.planta.trim().toLowerCase() === formData.planta.trim().toLowerCase()
        );

        if (yaExiste) {
            // ❌ Si se encuentra un duplicado, establece el error y detiene la función
            setFormError('❌ Esta propiedad (Dirección, Número y CP) ya se encuentra registrada localmente.');
            return; // Detiene la ejecución para NO enviar la solicitud al servidor
        }

        // 3. Si no es un duplicado local, procede a intentar guardar en el backend
        try {
            await axios.post(API_PROPIEDADES_URL, formData);

            // Operaciones post-éxito:
            setFormData({
                idPropietario: '',
                direccion: '',
                numero: '',
                poblacion: '',
                cp: '',
                planta: '',
                coeficiente: ''
            });

            const propiedadesResponse = await axios.get(API_PROPIEDADES_URL);
            setPropiedades(propiedadesResponse.data);
            setShowModal(false);

        } catch (error) {
            console.error('Error al guardar la propiedad:', error);
            // 💡 Sugerencia: Intenta mostrar un mensaje más específico si el backend devuelve el error de duplicado.
            const serverError = error.response?.data?.message || 'Error al guardar la propiedad. Verifica los campos.';
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

    return (
        <div className="container mt-4">
            <h1 className="text-center">Vista de Propiedades</h1>

            {/* Botón para abrir modal */}
            <div className="text-center mb-4">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Registrar Nueva Propiedad
                </button>
            </div>

            {/* Fondo oscuro (sin onClick para que no se cierre al hacer clic fuera) */}
            {showModal && <div className="custom-modal-backdrop"></div>}

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
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="cp" className="form-label">CP</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="cp"
                                                name="cp"
                                                value={formData.cp}
                                                onChange={handleChange}
                                                required
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
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="coeficiente" className="form-label">Coeficiente</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="coeficiente"
                                                name="coeficiente"
                                                value={formData.coeficiente}
                                                onChange={handleChange}
                                                required
                                                step="0.01"
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-primary">💾 Guardar Propiedad</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
