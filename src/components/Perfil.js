import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Perfil({ token }) {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        tipo: 'empleado',
        rol: ''
    });
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const API_URL = 'http://localhost:3001/api/usuarios';

    useEffect(() => {
        // Función para cargar usuarios
        const cargarUsuarios = () => {
            axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setUsuarios(res.data))
                .catch(err => console.error(err));
        };

        // Función para cargar roles
        const cargarRoles = () => {
            axios.get('http://localhost:3001/api/roles', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setRoles(res.data))
                .catch(err => console.error(err));
        };

        cargarUsuarios();
        cargarRoles();
    }, [token]); // ✅ Solo depende de token

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validaciones extra
        if (!formData.nombre.trim()) return alert("El nombre es obligatorio");
        if (!formData.email.includes('@')) return alert("Email inválido");
        if (formData.password.length < 6) return alert("La contraseña debe tener al menos 6 caracteres");
        if (!formData.rol) return alert("Debe seleccionar un rol");

        axios.post(API_URL, formData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert('Usuario creado correctamente');
                setFormData({ nombre: '', email: '', password: '', tipo: 'empleado', rol: '' });
                setShowModal(false);
                // Recargar usuarios después de alta
                axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })
                    .then(res => setUsuarios(res.data));
            })
            .catch(err => {
                console.error(err);
                alert('Error al crear usuario');
            });
    };

    const eliminarUsuario = (id) => {
        if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
            axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => setUsuarios(usuarios.filter(u => u._id !== id)))
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="container mt-4">
            <h2>Administración de Usuarios</h2>

            {/* Tabla de usuarios */}
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Tipo</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {usuarios.map(u => (
                    <tr key={u._id}>
                        <td>{u.nombre}</td>
                        <td>{u.email}</td>
                        <td>{u.tipo}</td>
                        <td>{u.rol?.nombre}</td>
                        <td>
                            <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/editar/${u._id}`)}>Editar</button>
                            <button className="btn btn-danger btn-sm" onClick={() => eliminarUsuario(u._id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Botones Volver y Alta */}
            <div className="mt-3">
                <button className="btn btn-secondary me-2" onClick={() => navigate('/dashboard')}>Volver</button>
                <button className="btn btn-success" onClick={() => setShowModal(true)}>Alta</button>
            </div>

            {/* Modal de alta */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Dar de Alta Usuario</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Contraseña</label>
                                        <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Tipo</label>
                                        <select name="tipo" className="form-select" value={formData.tipo} onChange={handleChange}>
                                            <option value="empleado">Empleado</option>
                                            <option value="cliente">Cliente</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Rol</label>
                                        <select name="rol" className="form-select" value={formData.rol} onChange={handleChange} required>
                                            <option value="">Seleccione un rol</option>
                                            {roles.map(r => (
                                                <option key={r._id} value={r._id}>{r.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-success">Guardar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
