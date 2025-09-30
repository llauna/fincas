// src/components/Propietarios
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Propietarios = () => {
    const navigate = useNavigate();
    const [propietarios, setPropietarios] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [comunidades, setComunidades] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // Guardar propietario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_PROPIETARIOS, formData);
            setFormData({
                nombre: '',
                telefono: '',
                email: '',
                gestorFinca: '',
                comunidades: []
            });
            fetchData();
        } catch (error) {
            console.error('Error al guardar propietario:', error.response?.data || error.message);
        }
    };

    // Eliminar propietario
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_PROPIETARIOS}/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error al eliminar propietario:', error);
        }
    };

    // --- FUNCIONES DE ACCIÓN PARA LA TABLA ---

    // Función para manejar la edición
    const handleEdit = (id) => {
        navigate(`/propietarios/editar/${id}`);
    };

    // Función para manejar la gestión de comunidades
    const handleManageComunidades = (propietarioId) => {
        // Implementar Modal o navegación
        alert(`Gestionar comunidades para Propietario ID: ${propietarioId}`);
        // navigate(`/comunidades/gestion/${propietarioId}`);
    };

    // Función para gestionar el Gestor de Finca
    const handleManageGestor = (propietario) => {
        if (propietario.gestorFinca) {
            // Implementar navegación a la vista del gestor
            alert(`Editando/Viendo Gestor ID: ${propietario.gestorFinca._id}`);
            // navigate(`/gestores/editar/${propietario.gestorFinca._id}`);
        } else {
            // Implementar navegación a la vista de asignación
            alert(`Añadir Gestor al Propietario ID: ${propietario._id}`);
            // navigate(`/gestores/asignar/${propietario._id}`);
        }
    };

    // --- FIN FUNCIONES DE ACCIÓN PARA LA TABLA ---

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
    }

    return (
        <div className="container mt-4">
            <h1>Gestión de Propietarios</h1>

            {/* Formulario */}
            <div className="card my-4">
                <div className="card-header bg-dark text-white">
                    Alta Propietario
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Teléfono</label>
                            <input type="text" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} />
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
                        <button type="submit" className="btn btn-success me-2">
                            Guardar
                        </button>
                    </form>
                </div>
            </div>

            {/* Tabla */}
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
                    // Determinar el conteo de comunidades para el botón
                    const comunidadesCount = prop.comunidades ? prop.comunidades.length : 0;

                    // --- Lógica de la celda Gestor de Finca (SOLO TEXTO) ---
                    const gestorNombre = prop.gestorFinca?.nombre || 'Sin gestor';

                    // --- Lógica para los botones de ACCIONES ---
                    const gestorBotonTexto = prop.gestorFinca ? 'Ver/Editar Gestor' : 'Añadir Gestor';
                    const gestorBotonColor = prop.gestorFinca ? 'btn-primary' : 'btn-success';

                    return (
                        <tr key={prop._id}>
                            <td>{prop.nombre}</td>
                            <td>{prop.telefono}</td>
                            <td>{prop.email}</td>

                            {/* CELDA DE GESTOR DE FINCA (SOLO TEXTO) */}
                            <td>{gestorNombre}</td>

                            {/* CELDA DE COMUNIDADES (SOLO TEXTO) */}
                            <td>
                                {comunidadesCount > 0
                                    ? prop.comunidades.map(c => c.nombre).join(', ')
                                    : 'Sin comunidades'}
                            </td>

                            {/* CELDA DE ACCIONES (TODOS LOS BOTONES) */}
                            <td>
                                <button
                                    className={`btn ${gestorBotonColor} btn-sm me-2`}
                                    onClick={() => handleManageGestor(prop)}
                                    title={gestorBotonTexto} // Añade un tooltip para más claridad
                                >
                                    {/* Muestra un icono o una versión abreviada en la columna de acciones */}
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