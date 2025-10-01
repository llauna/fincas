import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/propiedades.css';

const Propietarios = () => {
    const navigate = useNavigate();
    const [propietarios, setPropietarios] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [comunidades, setComunidades] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para el Modal de Alta/Edición
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Indica si estamos editando
    const [editingPropietarioId, setEditingPropietarioId] = useState(null); // ID del propietario a editar
    const [formSubmitError, setFormSubmitError] = useState('');

    // Estados para el Modal de Gestión de Comunidades
    const [showManagementModal, setShowManagementModal] = useState(false);
    const [propietarioComunidades, setPropietarioComunidades] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        gestorFinca: '',
        comunidades: []
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

    // --- FUNCIONES DE RESETEO Y MODAL PRINCIPAL ---

    const resetForm = () => {
        setFormData({
            nombre: '',
            telefono: '',
            email: '',
            gestorFinca: '',
            comunidades: []
        });
        setFormSubmitError('');
        setIsEditing(false);
        setEditingPropietarioId(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    // --- LÓGICA DE EDICIÓN (PRECarga del Formulario) ---

    const handleEdit = (id) => {
        const propietarioToEdit = propietarios.find(p => p._id === id);
        if (propietarioToEdit) {

            // 1. Preparar las comunidades: Mapear para asegurar que solo haya IDs válidas
            const comunidadesIDs = propietarioToEdit.comunidades
                ? propietarioToEdit.comunidades.map(c => c._id || c)
                : [];

            // 2. Precargar formData
            setFormData({
                _id: propietarioToEdit._id,
                nombre: propietarioToEdit.nombre,
                telefono: propietarioToEdit.telefono,
                email: propietarioToEdit.email,
                gestorFinca: propietarioToEdit.gestorFinca || '',
                comunidades: comunidadesIDs
            });

            // 3. Activar el modo edición y abrir el modal
            setIsEditing(true);
            setEditingPropietarioId(id);
            setShowModal(true);
        } else {
            console.error(`Propietario con ID ${id} no encontrado.`);
        }
    };

    // --- FUNCIÓN PRINCIPAL DE GUARDADO/ACTUALIZACIÓN ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitError('');

        let url = API_PROPIETARIOS;
        let method = 'post';
        let dataToSend = formData;
        let actionType = 'crear';

        // Lógica de Edición o Creación (incluyendo detección de duplicados al crear)
        if (isEditing) {
            // Caso 1: EDICIÓN (PUT). No se necesita buscar duplicado.
            url = `${API_PROPIETARIOS}/${editingPropietarioId}`;
            method = 'put';
            actionType = 'actualizar';

            // Aquí no se requiere fusión, el modal de edición reemplaza las comunidades seleccionadas.
            // Si el usuario quiere mantener las viejas, debe seleccionarlas de nuevo.
            // Si quieres que las mantenga por defecto, tendrías que precargar el select.
            // Por ahora, asumimos que el modal de edición define el nuevo conjunto.

        } else {
            // Caso 2: CREACIÓN (POST). Comprobamos duplicado para cambiar a PUT.
            const emailIngresado = formData.email.trim().toLowerCase();
            const propietarioExistente = propietarios.find(p =>
                p.email && p.email.toLowerCase() === emailIngresado
            );

            if (propietarioExistente) {
                // Modo ACTUALIZACIÓN por duplicidad
                url = `${API_PROPIETARIOS}/${propietarioExistente._id}`;
                method = 'put';
                actionType = 'actualizar';

                // LÓGICA DE FUSIÓN (porque el usuario NO estaba en modo edición)
                const comunidadesExistentesIDs = propietarioExistente.comunidades
                    ? propietarioExistente.comunidades.map(c => c._id || c)
                    : [];

                const comunidadesNuevasIDs = formData.comunidades;

                const comunidadesFusionadas = Array.from(new Set([...comunidadesExistentesIDs, ...comunidadesNuevasIDs]));

                dataToSend = {
                    ...formData,
                    comunidades: comunidadesFusionadas
                };
            }
        }

        // 3. Ejecución de la llamada a la API
        try {
            if (method === 'post') {
                await axios.post(url, dataToSend);
            } else {
                await axios.put(url, dataToSend);
            }

            // --- CÓDIGO DE ÉXITO ---
            resetForm();
            await fetchData();
            setShowModal(false);

        } catch (error) {
            console.error(`Error al ${actionType} propietario:`, error.response?.data || error.message);

            let errorMessage = `Error al ${actionType} propietario. Por favor, verifica los campos.`;

            // Manejo de errores
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
                    errorMessage = `El servidor devolvió un error: ${JSON.stringify(data)}`;
                }
            } else if (error.message) {
                errorMessage = `Error de conexión: ${error.message}`;
            }

            setFormSubmitError(errorMessage);
        }
    };

    // --- GESTIÓN DE COMUNIDADES (C-GES) ---

    // 1. Abrir modal de gestión
    const handleManageComunidades = (propietarioId) => {
        const propietario = propietarios.find(p => p._id === propietarioId);
        if (propietario) {
            setPropietarioComunidades(propietario);
            setShowManagementModal(true);
        }
    };

    // 2. Lógica para eliminar una sola comunidad
    const handleRemoveCommunity = async (propietarioId, comunidadIdToRemove) => {
        const propietario = propietarioComunidades;
        if (!propietario || !window.confirm("¿Seguro que quieres desvincular esta comunidad del propietario?")) {
            return;
        }

        // Crear el nuevo array de IDs, excluyendo la comunidad a eliminar
        const comunidadesActuales = propietario.comunidades.map(c => c._id || c);
        const nuevasComunidades = comunidadesActuales.filter(id => id !== comunidadIdToRemove);

        try {
            // Ejecutar la actualización (PUT) con el nuevo array
            await axios.put(`${API_PROPIETARIOS}/${propietarioId}`, { comunidades: nuevasComunidades });

            // Éxito: Recargar la lista principal y actualizar el modal de gestión
            await fetchData();

            // Actualizar el estado del modal de gestión con los datos frescos
            const updatedPropietario = propietarios.find(p => p._id === propietarioId);
            setPropietarioComunidades(updatedPropietario);

        } catch (error) {
            console.error('Error al desvincular comunidad:', error);
            alert('Error al desvincular comunidad. Inténtelo de nuevo.');
        }
    };

    // --- GESTIÓN DE ELIMINAR Y VOLVER ---

    const handleDelete = async (id) => {
        if (window.confirm('⚠️ ¿Estás seguro de que deseas eliminar este propietario? Esta acción es irreversible.')) {
            try {
                await axios.delete(`${API_PROPIETARIOS}/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error al eliminar propietario:', error);
                alert('Error al eliminar propietario. Consulte la consola para más detalles.');
            }
        }
    };

    const handleManageGestor = (propietario) => {
        if (propietario.gestorFinca) {
            // Esto se reemplazaría idealmente por un modal de gestión de Gestor
            alert(`Editando/Viendo Gestor ID: ${propietario.gestorFinca._id || propietario.gestorFinca}. (Lógica Pendiente)`);
        } else {
            // Esto se reemplazaría idealmente por un modal para asignar un Gestor
            alert(`Añadir Gestor al Propietario ID: ${propietario._id}. (Lógica Pendiente)`);
        }
    };

    const handleGoBack = () => { navigate(-1); };

    // Helpers para la tabla (sin cambios)
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

    // --- RENDERIZADO DEL COMPONENTE ---

    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center">Gestión de Propietarios</h1>

            <div className="text-center mb-4">
                <button className="btn btn-primary" onClick={() => { setIsEditing(false); setShowModal(true); }}>
                    ➕ Registrar Nuevo Propietario
                </button>
            </div>

            {/* -------------------- MODAL DE ALTA/EDICIÓN -------------------- */}
            {showModal && <div className="custom-modal-backdrop" onClick={handleCloseModal}></div>}

            {showModal && (
                <div className="modal fade show custom-modal" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">{isEditing ? 'Editar Propietario' : 'Alta de Propietario'}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
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
                                            💾 {isEditing ? 'Guardar Cambios' : 'Guardar Propietario'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* -------------------- MODAL DE GESTIÓN DE COMUNIDADES (C-Ges) -------------------- */}
            {showManagementModal && propietarioComunidades && (
                <div className="custom-modal-backdrop" onClick={() => setShowManagementModal(false)}>
                    <div className="modal fade show custom-modal" style={{ display: 'block' }} tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content" onClick={e => e.stopPropagation()}>
                                <div className="modal-header bg-info text-white">
                                    <h5 className="modal-title">
                                        Gestionar Comunidades de {propietarioComunidades.nombre}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowManagementModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    {propietarioComunidades.comunidades.length === 0 ? (
                                        <p>Este propietario no está asociado a ninguna comunidad.</p>
                                    ) : (
                                        <ul className="list-group">
                                            {propietarioComunidades.comunidades.map(comunidad => {
                                                // Aseguramos obtener el ID y el nombre
                                                const comunidadId = comunidad._id || comunidad;
                                                const nombreComunidad = comunidades.find(c => c._id === comunidadId)?.nombre || `ID Desconocido: ${comunidadId}`;

                                                return (
                                                    <li key={comunidadId} className="list-group-item d-flex justify-content-between align-items-center">
                                                        {nombreComunidad}
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleRemoveCommunity(propietarioComunidades._id, comunidadId)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowManagementModal(false)}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* -------------------- TABLA DE LISTADO -------------------- */}
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
                    const comunidadesCount = prop.comunidades ? prop.comunidades.length : 0;
                    const gestorBotonTexto = prop.gestorFinca ? 'Ver/Editar Gestor' : 'Añadir Gestor';
                    const gestorBotonColor = prop.gestorFinca ? 'btn-primary' : 'btn-success';

                    return (
                        <tr key={prop._id}>
                            <td>{prop.nombre}</td>
                            <td>{prop.telefono}</td>
                            <td>{prop.email}</td>
                            <td>{getGestorNombre(prop.gestorFinca)}</td>
                            <td>{getComunidadesNombres(prop.comunidades)}</td>

                            <td>
                                <button
                                    className={`btn ${gestorBotonColor} btn-sm me-2`}
                                    onClick={() => handleManageGestor(prop)}
                                    title={gestorBotonTexto}
                                >
                                    G-Edit
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