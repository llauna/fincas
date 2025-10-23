// components/AdministradorFincas/AdministradorFincas.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAdministradoresFincas,
    createAdministradorFincas,
    updateAdministradorFincas,
    deleteAdministradorFincas,
} from '../../services/AdministradorFincasServices';
import { getComunidades } from '../../services/ComunidadesServices'; // Importar el servicio de comunidades

const initialForm = {
    idComunidad: '',
    nombre: '',
    telefono: '',
    email: '',
    cif: '',
};

const AdministradorFincas = () => {
    const navigate = useNavigate();
    const [administradores, setAdministradores] = useState([]);
    const [comunidades, setComunidades] = useState([]); // Estado para las comunidades
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchAdministradores();
        fetchComunidades(); // Cargar comunidades al montar el componente
    }, []);

    const fetchAdministradores = async () => {
        try {
            const data = await getAdministradoresFincas();
            setAdministradores(data);
        } catch (error) {
            console.error('Error al obtener administradores:', error.message);
            alert('Error al cargar administradores. Por favor, inténtelo de nuevo.');
        }
    };

    const fetchComunidades = async () => {
        try {
            const data = await getComunidades(); // Llama al servicio para obtener las comunidades
            setComunidades(data);
        } catch (error) {
            console.error('Error fetching comunidades:', error.message);
            if (error.response && error.response.status === 401) {
                alert('No tienes autorización para acceder a las comunidades. Por favor, inicia sesión.');
            } else {
                alert('Error al cargar comunidades. Por favor, inténtelo de nuevo.');
            }
        }
    };


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateAdministradorFincas(editingId, form);
            } else {
                await createAdministradorFincas(form);
            }
            setForm(initialForm);
            setEditingId(null);
            fetchAdministradores();
        } catch (error) {
            console.error('Error al guardar administrador:', error.message);
            alert('Error al guardar administrador. Por favor, inténtelo de nuevo.');
        }
    };

    const handleEdit = (administrador) => {
        setForm({
            idComunidad: administrador.idComunidad || '',
            nombre: administrador.nombre,
            telefono: administrador.telefono,
            email: administrador.email,
            cif: administrador.cif,
        });
        setEditingId(administrador._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que quieres eliminar este administrador?')) {
            try {
                await deleteAdministradorFincas(id);
                fetchAdministradores();
            } catch (error) {
                console.error('Error al eliminar administrador:', error.message);
                alert('Error al eliminar administrador. Por favor, inténtelo de nuevo.');
            }
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const getComunidadNombre = (idComunidad) => {
        const comunidad = comunidades.find((com) => com._id === idComunidad);
        return comunidad ? comunidad.nombre : 'Comunidad no encontrada';
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Información Empresa</h1>
            <form className="row g-3 mb-4" onSubmit={handleSubmit}>
                <div className="col-md-4">
                    <label className="form-label">Comunidad</label>
                    <select
                        className="form-control"
                        name="idComunidad"
                        value={form.idComunidad}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione una comunidad</option>
                        {comunidades.map((comunidad) => (
                            <option key={comunidad._id} value={comunidad._id}>
                                {comunidad.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <input
                        className="form-control"
                        name="nombre"
                        placeholder="Nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-4">
                    <input
                        className="form-control"
                        name="telefono"
                        placeholder="Teléfono"
                        value={form.telefono}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-4">
                    <input
                        className="form-control"
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-4">
                    <input
                        className="form-control"
                        name="cif"
                        placeholder="CIF"
                        value={form.cif}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                    <button className="btn btn-primary me-2" type="submit">
                        {editingId ? 'Actualizar' : 'Crear'}
                    </button>
                    {editingId && (
                        <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={() => {
                                setForm(initialForm);
                                setEditingId(null);
                            }}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Comunidad</th>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>CIF</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {administradores.map((admin) => (
                    <tr key={admin._id}>
                        <td>{getComunidadNombre(admin.idComunidad)}</td>
                        <td>{admin.nombre}</td>
                        <td>{admin.telefono}</td>
                        <td>{admin.email}</td>
                        <td>{admin.cif}</td>
                        <td>
                            <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => handleEdit(admin)}
                            >
                                Editar
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(admin._id)}
                            >
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

export default AdministradorFincas;
