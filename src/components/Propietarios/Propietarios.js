// src/components/Propietarios
// src/components/Propietarios/Propietarios.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Propietarios = () => {
    const navigate = useNavigate();
    const [propietarios, setPropietarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '' });
    const [editingId, setEditingId] = useState(null); // Estado para la edición

    const API_URL = 'http://localhost:3001/api/propietarios';

    // Función para obtener todos los propietarios
    const fetchPropietarios = async () => {
        try {
            const response = await axios.get(API_URL);
            setPropietarios(response.data);
        } catch (error) {
            console.error('Error al obtener los propietarios:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPropietarios();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Función para crear o actualizar un propietario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Si hay un ID de edición, actualiza
                await axios.put(`${API_URL}/${editingId}`, formData);
                setEditingId(null); // Desactiva el modo de edición
            } else {
                // Si no, crea uno nuevo
                await axios.post(API_URL, formData);
            }
            setFormData({ nombre: '', email: '', telefono: '' }); // Limpia el formulario
            fetchPropietarios(); // Recarga la lista
        } catch (error) {
            console.error('Error al guardar el propietario:', error);
        }
    };

    // Función para eliminar un propietario
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchPropietarios(); // Recarga la lista
        } catch (error) {
            console.error('Error al eliminar el propietario:', error);
        }
    };

    // Función para activar el modo de edición
    const handleEdit = (propietario) => {
        setFormData({
            nombre: propietario.nombre,
            email: propietario.email,
            telefono: propietario.telefono,
        });
        setEditingId(propietario._id);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
    }

    return (
        <div className="container mt-4">
            <h1>Gestión de Propietarios</h1>

            {/* Formulario para dar de alta/modificar */}
            <div className="card my-4">
                <div className="card-header bg-dark text-white">
                    {editingId ? 'Editar Propietario' : 'Dar de Alta Nuevo Propietario'}
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Teléfono</label>
                            <input type="tel" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-success me-2">
                            {editingId ? 'Actualizar' : 'Guardar'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData({ nombre: '', email: '', telefono: '' });
                                }}
                            >
                                Cancelar
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {/* Tabla para mostrar y gestionar propietarios */}
            <h2 className="mt-5">Listado de Propietarios</h2>
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Acciones</th> {/* Nueva columna para los botones */}
                </tr>
                </thead>
                <tbody>
                {propietarios.map(prop => (
                    <tr key={prop._id}>
                        <td>{prop.nombre}</td>
                        <td>{prop.email}</td>
                        <td>{prop.telefono}</td>
                        <td>
                            <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => handleEdit(prop)}
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

export default Propietarios;