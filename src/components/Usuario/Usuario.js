// src/components/Usuario/Usuarios.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Usuarios = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        nombre: '',
        rol: '',
        email: '',
        password: '',
    });

    const API_URL = 'http://localhost:3001/api/usuarios';

    // Fetch all 'Usuario' from the API
    const fetchUsuarios = async () => {
        try {
            const response = await axios.get(API_URL);
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    // This effect runs once when the component mounts to fetch initial data.
    useEffect(() => {
        fetchUsuarios();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission to create a new 'Usuario'
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, formData);
            // Reset form and refresh the list
            setFormData({
                nombre: '',
                rol: '',
                email: '',
                password: '',
            });
            fetchUsuarios();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    // Handle deletion of a 'Usuario'
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchUsuarios();
        } catch (error) {
            console.error('Error deleting user:', error);
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
            <h1>Gestión de Usuarios</h1>

            {/* Form to create a new 'Usuario' */}
            <div className="card my-4">
                <div className="card-header bg-dark text-white">
                    Dar de Alta Nuevo Usuario
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Rol</label>
                            <input type="text" className="form-control" name="rol" value={formData.rol} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-success me-2">
                            Guardar
                        </button>
                    </form>
                </div>
            </div>

            {/* Table to display and manage 'Usuario' */}
            <h2 className="mt-5">Listado de Usuarios</h2>
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Email</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {usuarios.map(usuario => (
                    <tr key={usuario._id}>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.rol}</td>
                        <td>{usuario.email}</td>
                        <td>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(usuario._id)}
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
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

export default Usuarios;