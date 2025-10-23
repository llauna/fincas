// components/Propietarios/Propietarios.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/propiedades.css';
import {
    getPropietarios,
    getEmpresas,
    getComunidades,
    createPropietario,
    updatePropietario,
    deletePropietario
} from '../../controllers/propietarioController';

const Propietarios = () => {
    const navigate = useNavigate();
    const [propietarios, setPropietarios] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [comunidades, setComunidades] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPropietarioId, setEditingPropietarioId] = useState(null);
    const [formSubmitError, setFormSubmitError] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        gestorFinca: '',
        comunidades: []
    });

    const fetchData = async () => {
        try {
            const [propietariosData, empresasData, comunidadesData] = await Promise.all([
                getPropietarios(),
                getEmpresas(),
                getComunidades()
            ]);
            setPropietarios(propietariosData);
            setEmpresas(empresasData);
            setComunidades(comunidadesData);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleChangeComunidades = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setFormData({ ...formData, comunidades: selectedOptions });
    };

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

    const handleEdit = (id) => {
        const propietarioToEdit = propietarios.find(p => p._id === id);
        if (propietarioToEdit) {
            const comunidadesIDs = propietarioToEdit.comunidades
                ? propietarioToEdit.comunidades.map(c => c._id || c)
                : [];
            setFormData({
                nombre: propietarioToEdit.nombre,
                telefono: propietarioToEdit.telefono,
                email: propietarioToEdit.email,
                gestorFinca: propietarioToEdit.gestorFinca || '',
                comunidades: comunidadesIDs
            });
            setIsEditing(true);
            setEditingPropietarioId(id);
            setShowModal(true);
        } else {
            console.error(`Propietario con ID ${id} no encontrado.`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitError('');
        try {
            if (isEditing) {
                await updatePropietario(editingPropietarioId, formData);
            } else {
                await createPropietario(formData);
            }
            resetForm();
            await fetchData();
            setShowModal(false);
        } catch (error) {
            console.error('Error al guardar propietario:', error);
            setFormSubmitError('Error al guardar propietario. Por favor, verifica los campos.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este propietario?')) {
            try {
                await deletePropietario(id);
                fetchData();
            } catch (error) {
                console.error('Error al eliminar propietario:', error);
                alert('Error al eliminar propietario.');
            }
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const getGestorNombre = (gestorId) => {
        const gestorEncontrado = empresas.find(emp => emp._id === gestorId);
        return gestorEncontrado ? gestorEncontrado.nombre : 'Sin gestor';
    };

    const getComunidadesNombres = (comunidadIds) => {
        if (!comunidadIds || comunidadIds.length === 0) return 'Sin comunidades';
        const comunidadesRelacionadas = comunidades.filter(c =>
            comunidadIds.includes(c._id) || comunidadIds.some(id => id === c._id)
        );
        return comunidadesRelacionadas.map(c => c.nombre).join(', ');
    };

    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center">Gestión de Propietarios</h1>
            <button className="btn btn-primary" onClick={() => { setIsEditing(false); setShowModal(true); }}>
                ➕ Registrar Nuevo Propietario
            </button>

            {/* Modal de alta/edición */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Editar Propietario' : 'Registrar Propietario'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                {formSubmitError && <div className="alert alert-danger">{formSubmitError}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Teléfono</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
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
                                    </div>
                                    <button type="submit" className="btn btn-success">
                                        {isEditing ? 'Guardar Cambios' : 'Registrar'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla de propietarios */}
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
                {propietarios.map(prop => (
                    <tr key={prop._id}>
                        <td>{prop.nombre}</td>
                        <td>{prop.telefono}</td>
                        <td>{prop.email}</td>
                        <td>{getGestorNombre(prop.gestorFinca)}</td>
                        <td>{getComunidadesNombres(prop.comunidades)}</td>
                        <td>
                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(prop._id)}>
                                Editar
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(prop._id)}>
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={handleGoBack} className="btn btn-secondary mt-3">
                Volver
            </button>
        </div>
    );
};

export default Propietarios;
