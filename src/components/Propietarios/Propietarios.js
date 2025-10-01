// src/components/Propietarios
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// reutilizamos los estilos del modal
import '../../styles/propiedades.css';

const Propietarios = () => {
    const navigate = useNavigate();
    const [propietarios, setPropietarios] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [comunidades, setComunidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formSubmitError, setFormSubmitError] = useState('');

    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        gestorFinca: '',
        comunidades: [] // Contiene IDs de comunidades seleccionadas en el modal
    });

    // URLs del backend
    const API_PROPIETARIOS = 'http://localhost:3001/api/propietarios';
    const API_EMPRESAS = 'http://localhost:3001/api/administradorFincas';
    const API_COMUNIDADES = 'http://localhost:3001/api/comunidades';

    // Obtener datos iniciales
    const fetchData = async () => {
        try {
            const [propRes, empRes, comRes] = await Promise.all([
                axios.get(API_PROPIETARIOS),
                axios.get(API_EMPRESAS),
                axios.get(API_COMUNIDADES)
            ]);
            setPropietarios(propRes.data);
            setEmpresas(empRes.data);
            setComunidades(comRes.data);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Manejar cambios en inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Manejar cambios en selección múltiple de comunidades
    const handleChangeComunidades = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setFormData({ ...formData, comunidades: selectedOptions });
    };

    // --- FUNCIONES DE RESETEO Y MODAL ---

    // 1. FUNCIÓN PARA LIMPIAR LOS DATOS DEL FORMULARIO Y EL ERROR
    const resetForm = () => {
        setFormData({
            nombre: '',
            telefono: '',
            email: '',
            gestorFinca: '',
            comunidades: []
        });
        setFormSubmitError('');
    };

    // 2. FUNCIÓN PARA CERRAR EL MODAL Y RESETEAR
    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    // --- FUNCIÓN PRINCIPAL DE GUARDADO/ACTUALIZACIÓN ---

    // 3. FUNCIÓN MODIFICADA: Ahora maneja la lógica de Crear (POST) o Actualizar (PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitError('');

        // 1. Detección de Existencia
        const emailIngresado = formData.email.trim().toLowerCase();
        const propietarioExistente = propietarios.find(p =>
            p.email && p.email.toLowerCase() === emailIngresado
        );

        let url = API_PROPIETARIOS;
        let method = 'post';
        let dataToSend = formData; // Objeto de datos que finalmente se enviará

        if (propietarioExistente) {
            // Modo ACTUALIZACIÓN (PUT)
            url = `${API_PROPIETARIOS}/${propietarioExistente._id}`;
            method = 'put';

            // 🔑 LÓGICA DE FUSIÓN PARA EVITAR SOBRESCRIBIR COMUNIDADES EXISTENTES

            // Obtener las IDs de las comunidades que *ya tiene* el propietario
            const comunidadesExistentesIDs = propietarioExistente.comunidades
                ? propietarioExistente.comunidades.map(c => c._id || c) // Obtener solo IDs
                : [];

            // Obtener las IDs de las comunidades *seleccionadas en el modal*
            const comunidadesNuevasIDs = formData.comunidades;

            // FUSIONAR: Combinar ambas listas y eliminar duplicados (usando un Set)
            // IMPORTANTE: Convertimos el Set de nuevo a un Array para enviarlo al backend
            const comunidadesFusionadas = Array.from(new Set([...comunidadesExistentesIDs, ...comunidadesNuevasIDs]));

            // Actualizar el objeto a enviar con el array fusionado
            dataToSend = {
                ...formData,
                comunidades: comunidadesFusionadas
            };
        }

        try {
            // 2. Ejecutar la llamada a la API con 'dataToSend'
            if (method === 'post') {
                await axios.post(url, dataToSend);
            } else {
                // Se envía el objeto con el array de comunidades fusionado
                await axios.put(url, dataToSend);
            }

            // --- CÓDIGO DE ÉXITO ---
            resetForm();
            await fetchData(); // Aseguramos que la tabla se refresque antes de cerrar
            setShowModal(false);

        } catch (error) {
            console.error('Error al guardar/actualizar propietario:', error.response?.data || error.message);

            let errorMessage = 'Error al crear/actualizar propietario. Por favor, verifica los campos.';

            // Lógica robusta de manejo de errores (incluyendo E11000)
            if (error.response) {
                const data = error.response.data;

                if (data && data.message) {
                    errorMessage = data.message;
                } else if (data && data.error && (data.error.includes('E11000') || data.error.includes('duplicate key'))) {
                    const match = data.error.match(/dup key: \{ (\w+): "/);
                    const field = match ? match[1] : 'campo';
                    errorMessage = `❌ Error de duplicidad en el servidor: El valor para el ${field} ya existe.`;
                } else if (data && typeof data === 'string' && data.length > 0) {
                    errorMessage = data;
                } else if (data && typeof data === 'object') {
                    errorMessage = 'El servidor devolvió un error: ' + JSON.stringify(data);
                }
            } else if (error.message) {
                errorMessage = `Error de conexión: ${error.message}`;
            }

            setFormSubmitError(errorMessage);
        }
    };

    // --- Funciones auxiliares para la tabla (sin cambios) ---
    const handleDelete = async (id) => { /* ... */ };
    const handleEdit = (id) => { navigate(`/propietarios/editar/${id}`); };
    const handleManageComunidades = (propietarioId) => { alert(`Gestionar comunidades para Propietario ID: ${propietarioId}`); };
    const handleManageGestor = (propietario) => {
        if (propietario.gestorFinca) {
            alert(`Editando/Viendo Gestor ID: ${propietario.gestorFinca._id}`);
        } else {
            alert(`Añadir Gestor al Propietario ID: ${propietario._id}`);
        }
    };
    const handleGoBack = () => { navigate(-1); };

    // Helpers para la tabla
    const getGestorNombre = (gestorId) => {
        const gestorEncontrado = empresas.find(emp => emp._id === gestorId);
        return gestorEncontrado ? gestorEncontrado.nombre : 'Sin gestor';
    };
    const getComunidadesNombres = (comunidadIds) => {
        if (!comunidadIds || comunidadIds.length === 0) return 'Sin comunidades';

        const comunidadesRelacionadas = comunidades.filter(c =>
            comunidadIds.includes(c._id)
        );
        return comunidadesRelacionadas.map(c => c.nombre).join(', ');
    };

    // --- JSX (sin cambios funcionales, solo se asegura el uso de handleCloseModal) ---

    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center">Gestión de Propietarios</h1>

            <div className="text-center mb-4">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Registrar Nuevo Propietario
                </button>
            </div>

            {/* USAMOS handleCloseModal para el fondo y la X */}
            {showModal && <div className="custom-modal-backdrop" onClick={handleCloseModal}></div>}

            {showModal && (
                <div className="modal fade show custom-modal" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Alta de Propietario</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal} // Llama a handleCloseModal
                                ></button>
                            </div>
                            <div className="modal-body">

                                {formSubmitError && <div className="alert alert-danger">{formSubmitError}</div>}

                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Nombre</label>
                                            <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Teléfono</label>
                                            <input type="text" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Gestor de Finca</label>
                                        <select
                                            className="form-control"
                                            name="gestorFinca"
                                            value={formData.gestorFinca}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccione un gestor</option>
                                            {empresas.map(emp => (
                                                <option key={emp._id} value={emp._id}>
                                                    {emp.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Comunidades</label>
                                        <select
                                            className="form-control"
                                            name="comunidades"
                                            value={formData.comunidades}
                                            onChange={handleChangeComunidades}
                                            multiple
                                        >
                                            {comunidades.map(com => (
                                                <option key={com._id} value={com._id}>
                                                    {com.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        <small className="text-muted">
                                            Mantén presionada CTRL (Windows) o CMD (Mac) para seleccionar varias.
                                        </small>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-success me-2">
                                            💾 Guardar Propietario
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla de Listado */}
            <h2 className="mt-5">Listado de Propietarios</h2>
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Gestor de Finca</th>
                    <th>Comunidades</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {propietarios.map(prop => {
                    const gestorNombre = getGestorNombre(prop.gestorFinca);
                    const comunidadesNombres = getComunidadesNombres(prop.comunidades);
                    const comunidadesCount = prop.comunidades ? prop.comunidades.length : 0;
                    const gestorBotonTexto = prop.gestorFinca ? 'Ver/Editar Gestor' : 'Añadir Gestor';
                    const gestorBotonColor = prop.gestorFinca ? 'btn-primary' : 'btn-success';

                    return (
                        <tr key={prop._id}>
                            <td>{prop.nombre}</td>
                            <td>{prop.telefono}</td>
                            <td>{prop.email}</td>

                            <td>{gestorNombre}</td>
                            <td>{comunidadesNombres}</td>

                            <td>
                                <button
                                    className={`btn ${gestorBotonColor} btn-sm me-2`}
                                    onClick={() => handleManageGestor(prop)}
                                    title={gestorBotonTexto}
                                >
                                    {prop.gestorFinca ? 'G-Edit' : 'G-Add'}
                                </button>

                                <button
                                    className="btn btn-info btn-sm me-2"
                                    onClick={() => handleManageComunidades(prop._id)}
                                    title={`Gestionar ${comunidadesCount} Comunidades`}
                                >
                                    C-Ges ({comunidadesCount})
                                </button>

                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => handleEdit(prop._id)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(prop._id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <button
                onClick={handleGoBack}
                className="btn btn-secondary mt-3"
            >
                Volver
            </button>
        </div>
    );
};

export default Propietarios;