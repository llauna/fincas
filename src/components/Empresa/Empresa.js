import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Empresa = () => {
    const navigate = useNavigate();
    const [administradores, setAdministradores] = useState([]);
    const [comunidades, setComunidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        idComunidades: [],
        nombre: '',
        telefono: '',
        email: '',
        cif: ''
    });

    // URLs del backend
    const API_EMPRESAS = 'http://localhost:3001/api/administradorFincas';
    const API_COMUNIDADES = 'http://localhost:3001/api/comunidades';

    // Obtener empresas
    const fetchAdministradores = async () => {
        try {
            const response = await axios.get(API_EMPRESAS);
            setAdministradores(response.data);
        } catch (error) {
            console.error('Error fetching empresas:', error);
        } finally {
            setLoading(false);
        }
    };

    // Obtener comunidades
    const fetchComunidades = async () => {
        try {
            const response = await axios.get(API_COMUNIDADES);
            setComunidades(response.data);
        } catch (error) {
            console.error('Error fetching comunidades:', error);
        }
    };

    useEffect(() => {
        fetchAdministradores();
        fetchComunidades();
    }, []);

    // Manejar cambios en inputs normales
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Manejar cambios en selección múltiple de comunidades
    const handleChangeComunidades = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setFormData({ ...formData, idComunidades: selectedOptions });
    };

    // Guardar empresa
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_EMPRESAS, formData);
            setFormData({
                idComunidades: [],
                nombre: '',
                telefono: '',
                email: '',
                cif: ''
            });
            fetchAdministradores();
        } catch (error) {
            console.error('Error saving empresa:', error.response?.data || error.message);
        }
    };

    // Eliminar empresa
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_EMPRESAS}/${id}`);
            fetchAdministradores();
        } catch (error) {
            console.error('Error deleting empresa:', error);
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
            <h1>Información Empresa</h1>

            {/* Formulario */}
            <div className="card my-4">
                <div className="card-header bg-dark text-white">
                    Alta Nueva Empresa
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Comunidades</label>
                            <select
                                className="form-control"
                                name="idComunidades"
                                value={formData.idComunidades}
                                onChange={handleChangeComunidades}
                                multiple
                                required
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
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Teléfono</label>
                            <input type="text" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">CIF</label>
                            <input type="text" className="form-control" name="cif" value={formData.cif} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-success me-2">
                            Guardar
                        </button>
                    </form>
                </div>
            </div>

            {/* Tabla */}
            <h2 className="mt-5">Listado de Empresas</h2>
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Comunidades</th>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>CIF</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {administradores.map(admin => (
                    <tr key={admin._id}>
                        <td>{admin.comunidades?.map(c => c.nombre).join(', ') || 'Sin comunidades'}</td>
                        <td>{admin.nombre}</td>
                        <td>{admin.telefono}</td>
                        <td>{admin.email}</td>
                        <td>{admin.cif}</td>
                        <td>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(admin._id)}
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

export default Empresa;
