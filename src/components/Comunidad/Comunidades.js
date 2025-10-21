// components/Comunidad/Comunidades.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/propiedades.css';

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
    const [showModal, setShowModal] = useState(false);
    const [formError, setFormError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // ✅ URL correcta de tu API
    const API_URL = 'http://localhost:3001/api/comunidades';

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('📦 Token en localStorage:', token);
        console.log('📡 Llamando a:', API_URL);

        if (!token) {
            console.warn('⚠ No hay token, redirigiendo a login...');
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('✅ Datos recibidos:', response.data);
                setComunidades(response.data);
            } catch (error) {
                console.error('❌ Error al obtener las comunidades:', error);
                setFormError(error.response?.data?.message || 'Error al obtener comunidades');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCrearOEditar = async (e) => {
        e.preventDefault();
        setFormError('');

        const camposClave = {
            nombre: formData.nombre.trim().toLowerCase(),
            direccion: formData.direccion.trim().toLowerCase(),
            cp: formData.cp.trim()
        };

        const yaExiste = comunidades.some(com =>
            com.nombre.trim().toLowerCase() === camposClave.nombre &&
            com.direccion.trim().toLowerCase() === camposClave.direccion &&
            com.cp === camposClave.cp
        );

        if (yaExiste && !editMode) {
            setFormError('❌ Esta comunidad ya está registrada.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            console.log('📡 POST/PUT a:', API_URL, 'con token:', token);

            if (editMode) {
                await axios.put(`${API_URL}/${editId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(API_URL, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setFormData({ nombre: '', direccion: '', poblacion: '', cp: '', provincia: '' });
            setShowModal(false);
            setEditMode(false);
            setEditId(null);

            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComunidades(response.data);
        } catch (error) {
            console.error('❌ Error al guardar la comunidad:', error);
            setFormError(error.response?.data?.message || 'Error al guardar la comunidad.');
        }
    };

    const handleEliminar = async (id) => {
        try {
            const token = localStorage.getItem('token');
            console.log('📡 DELETE a:', `${API_URL}/${id}`, 'con token:', token);

            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComunidades(response.data);
        } catch (error) {
            console.error('❌ Error al eliminar la comunidad:', error);
        }
    };

    const handleEditar = (comunidad) => {
        setFormData({
            nombre: comunidad.nombre,
            direccion: comunidad.direccion,
            poblacion: comunidad.poblacion,
            cp: comunidad.cp,
            provincia: comunidad.provincia
        });
        setEditMode(true);
        setEditId(comunidad._id);
        setShowModal(true);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center">Gestión de Comunidades</h1>

            <div className="text-center mb-4">
                <button className="btn btn-primary" onClick={() => { setShowModal(true); setEditMode(false); }}>
                    ➕ Registrar Nueva Comunidad
                </button>
            </div>

            {showModal && <div className="custom-modal-backdrop"></div>}

            {showModal && (
                <div className="modal fade show custom-modal" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">{editMode ? 'Editar Comunidad' : 'Registrar Nueva Comunidad'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {formError && <div className="alert alert-danger">{formError}</div>}
                                <form onSubmit={handleCrearOEditar} noValidate>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Nombre</label>
                                            <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Dirección</label>
                                            <input type="text" className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Población</label>
                                            <input type="text" className="form-control" name="poblacion" value={formData.poblacion} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">CP</label>
                                            <input type="text" className="form-control" name="cp" value={formData.cp} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Provincia</label>
                                            <input type="text" className="form-control" name="provincia" value={formData.provincia} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-primary">{editMode ? '💾 Guardar Cambios' : '💾 Guardar Comunidad'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="mt-5">Listado de Comunidades</h2>
            <table className="table table-striped">
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
                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(comunidad)}>Editar</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(comunidad._id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button onClick={handleGoBack} className="btn btn-secondary mt-3">Volver</button>
        </div>
    );
};

export default Comunidades;
