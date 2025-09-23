// src/components/Comunidad/Comunidades.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Comunidades = () => {
    const navigate = useNavigate();
    const [comunidades, setComunidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        poblacion: '',
        cp: '',
        provincia: ''
    });

    const API_URL = 'http://localhost:3001/api/comunidades';

    const fetchComunidades = async () => {
        try {
            const response = await axios.get(API_URL);
            setComunidades(response.data);
        } catch (error) {
            console.error('Error al obtener las comunidades:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComunidades();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, formData);
            setFormData({ nombre: '', direccion: '', poblacion: '', cp: '', provincia: '' });
            fetchComunidades();
        } catch (error) {
            console.error('Error al guardar la comunidad:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchComunidades();
        } catch (error) {
            console.error('Error al eliminar la comunidad:', error);
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
            <h1>Gestión de Comunidades</h1>

            {/* Formulario para dar de alta */}
            <div className="card my-4">
                <div className="card-header bg-dark text-white">
                    Dar de Alta Nueva Comunidad
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Dirección</label>
                            <input type="text" className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Población</label>
                            <input type="text" className="form-control" name="poblacion" value={formData.poblacion} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">CP</label>
                            <input type="text" className="form-control" name="cp" value={formData.cp} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Provincia</label>
                            <input type="text" className="form-control" name="provincia" value={formData.provincia} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-success me-2">
                            Guardar
                        </button>
                    </form>
                </div>
            </div>

            {/* Tabla para mostrar y gestionar comunidades */}
            <h2 className="mt-5">Listado de Comunidades</h2>
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Población</th>
                    <th>CP</th>
                    <th>Provincia</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {comunidades.map(comunidad => (
                    <tr key={comunidad._id}>
                        <td>{comunidad.nombre}</td>
                        <td>{comunidad.direccion}</td>
                        <td>{comunidad.poblacion}</td>
                        <td>{comunidad.cp}</td>
                        <td>{comunidad.provincia}</td>
                        <td>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(comunidad._id)}
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

export default Comunidades;
