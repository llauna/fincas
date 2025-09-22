import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAdministradoresFincas,
    createAdministradorFincas,
    updateAdministradorFincas,
    deleteAdministradorFincas,
} from '../../services/AdministradorFincasServices';

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
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchAdministradores();
    }, []);

    const fetchAdministradores = async () => {
        const data = await getAdministradoresFincas();
        setAdministradores(data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await updateAdministradorFincas(editingId, form);
        } else {
            await createAdministradorFincas(form);
        }
        setForm(initialForm);
        setEditingId(null);
        fetchAdministradores();
    };

    const handleEdit = (administrador) => {
        setForm(administrador);
        setEditingId(administrador._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que quieres eliminar este administrador?')) {
            await deleteAdministradorFincas(id);
            fetchAdministradores();
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Gestión de Administradores de Fincas</h1>
            <form className="row g-3 mb-4" onSubmit={handleSubmit}>
                <div className="col-md-4">
                    <input className="form-control" name="idComunidad" placeholder="ID Comunidad" value={form.idComunidad} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                    <input className="form-control" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                    <input className="form-control" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                    <input className="form-control" name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                    <input className="form-control" name="cif" placeholder="CIF" value={form.cif} onChange={handleChange} required />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                    <button className="btn btn-primary me-2" type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
                    {editingId && (
                        <button className="btn btn-secondary" type="button" onClick={() => { setForm(initialForm); setEditingId(null); }}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>ID Comunidad</th>
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
                        <td>{admin.idComunidad}</td>
                        <td>{admin.nombre}</td>
                        <td>{admin.telefono}</td>
                        <td>{admin.email}</td>
                        <td>{admin.cif}</td>
                        <td>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(admin)}>Editar</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(admin._id)}>Eliminar</button>
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

export default AdministradorFincas;