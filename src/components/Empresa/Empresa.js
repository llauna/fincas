// components/Empresa/Empresa.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ComunidadesList from '../Comunidad/ComunidadesList';
import PropietariosModal from '../Propietarios/PropietariosModal';

const Empresa = () => {
    const navigate = useNavigate();
    const [empresas, setEmpresas] = useState([]);
    //const [comunidades, setComunidades] = useState([]);
    const [propietarios, setPropietarios] = useState([]);
    const [showPropietariosModal, setShowPropietariosModal] = useState(false);


    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        comunidades: [],
        nombre: '',
        telefono: '',
        email: '',
        cif: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [formError, setFormError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const API_EMPRESAS = 'http://localhost:3001/api/empresas';
    const API_COMUNIDADES = 'http://localhost:3001/api/comunidades';

    const fetchEmpresas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_EMPRESAS, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmpresas(response.data);
        } catch (error) {
            console.error('Error fetching empresas:', error);
            alert('Error al cargar empresas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmpresas();
        //fetchComunidades();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChangeComunidades = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setFormData({ ...formData, comunidades: selectedOptions });
    };

    const handleCrearOEditar = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!formData.nombre || !formData.telefono || !formData.email || !formData.cif) {
            setFormError('Todos los campos son obligatorios.');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            // Aseguramos que comunidades sea un array de IDs
            const payload = {
                ...formData,
                comunidades: formData.comunidades.map(id => id.toString())
            };
            if (editMode) {
                await axios.put(`${API_EMPRESAS}/${editId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(API_EMPRESAS, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setFormData({
                comunidades: [],
                nombre: '',
                telefono: '',
                email: '',
                cif: ''
            });
            setShowModal(false);
            setEditMode(false);
            setEditId(null);
            fetchEmpresas();
        } catch (error) {
            console.error('Error saving empresa:', error.response?.data || error.message);
            setFormError('Error al guardar la empresa.');
        }
    };

    const handleEliminar = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_EMPRESAS}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEmpresas();
        } catch (error) {
            console.error('Error deleting empresa:', error);
        }
    };

    const handleEditar = (empresa) => {
        console.log("ID que se va a editar:", empresa._id);
        setFormData({
            comunidades: empresa.comunidades?.map(c => c._id) || [],
            nombre: empresa.nombre,
            telefono: empresa.telefono,
            email: empresa.email,
            cif: empresa.cif
        });
        setEditMode(true);
        setEditId(empresa._id);
        setShowModal(true);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleVerPropietarios = async (comunidadId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_COMUNIDADES}/${comunidadId}/propietarios`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPropietarios(response.data);
            setShowPropietariosModal(true);
        } catch (error) {
            console.error('Error fetching propietarios:', error);
        }
    };

    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center">Gestión de Empresas</h1>

            <div className="text-center mb-4">
                <button className="btn btn-primary" onClick={() => { setShowModal(true); setEditMode(false); }}>
                    ➕ Registrar Nueva Empresa
                </button>
            </div>

            {showModal && <div className="custom-modal-backdrop"></div>}

            {showModal && (
                <div className="modal fade show custom-modal" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">{editMode ? 'Editar Empresa' : 'Registrar Nueva Empresa'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {formError && <div className="alert alert-danger">{formError}</div>}
                                <form onSubmit={handleCrearOEditar} noValidate>
                                    <div className="mb-3">
                                        <label className="form-label">Comunidades</label>
                                        <select
                                            className="form-control"
                                            name="comunidades"
                                            value={formData.comunidades}
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
                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-primary">{editMode ? '💾 Guardar Cambios' : '💾 Guardar Empresa'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="mt-5">Listado de Empresas</h2>
            <table className="table table-striped">
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
                {empresas.map(emp => (
                    <tr key={emp._id}>
                        <td>
                            <ComunidadesList
                                comunidades={emp.comunidades}
                                onVerPropietarios={handleVerPropietarios}
                            />
                        </td>
                        <td>{emp.nombre}</td>
                        <td>{emp.telefono}</td>
                        <td>{emp.email}</td>
                        <td>{emp.cif}</td>
                        <td>
                            {/* Botones de editar y eliminar */}
                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(emp)}>Editar</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(emp._id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showPropietariosModal && (
                <PropietariosModal
                    propietarios={propietarios}
                    onClose={() => setShowPropietariosModal(false)}
                />
            )}

            <button onClick={handleGoBack} className="btn btn-secondary mt-3">Volver</button>
        </div>
    );
};

export default Empresa;
