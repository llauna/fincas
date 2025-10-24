// components/Empresa/Empresa.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ComunidadesList from '../Comunidad/ComunidadesList';
import EmpresaFormModal from './EmpresaFormModal';

const Empresa = () => {
    const navigate = useNavigate();
    const [empresas, setEmpresas] = useState([]);
    const [comunidades, setComunidades] = useState([]);
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

    const fetchComunidades = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_COMUNIDADES, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComunidades(response.data);
        } catch (error) {
            console.error('Error fetching comunidades:', error);
            alert('Error al cargar comunidades.');
        }
    };

    useEffect(() => {
        fetchEmpresas();
        fetchComunidades();
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

    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center">Gestión de Empresas</h1>

            <div className="text-center mb-4">
                <button
                    className="btn btn-primary"
                    onClick={() => { setShowModal(true); setEditMode(false); }}
                >
                    ➕ Registrar Nueva Empresa
                </button>
            </div>

            {/* Modal separado */}
            <EmpresaFormModal
                show={showModal}
                editMode={editMode}
                formData={formData}
                comunidades={comunidades}
                formError={formError}
                handleChange={handleChange}
                handleChangeComunidades={handleChangeComunidades}
                handleSubmit={handleCrearOEditar}
                handleClose={() => setShowModal(false)}
            />

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
                            />
                        </td>
                        <td>{emp.nombre}</td>
                        <td>{emp.telefono}</td>
                        <td>{emp.email}</td>
                        <td>{emp.cif}</td>
                        <td>
                            <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => handleEditar(emp)}
                            >
                                Editar
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleEliminar(emp._id)}
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

export default Empresa;
