import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarUsuario({ token }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Token usado en EditarUsuario:", token);
        console.log("ID recibido desde la URL:", id);

        // Obtener datos del usuario
        axios.get(`http://localhost:3001/api/usuarios/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                const user = res.data.usuario ? res.data.usuario : res.data;
                setUsuario({
                    ...user,
                    rol: user.rol?._id || user.rol
                });
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status === 403) setError("No tienes permisos para editar este usuario.");
                    else if (err.response.status === 404) setError("Usuario no encontrado.");
                    else setError("Error al obtener el usuario.");
                } else {
                    setError("Error de conexión con el servidor.");
                }
            });

        // Obtener lista de roles
        axios.get('http://localhost:3001/api/roles', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => setRoles(res.data))
            .catch(err => {
                setError("Error al obtener la lista de roles.");
            });
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario({ ...usuario, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos enviados para actualizar:", usuario);

        axios.put(`http://localhost:3001/api/usuarios/${id}`, usuario, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(() => {
                alert('Usuario actualizado correctamente');
                navigate('/perfil');
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status === 403) setError("No tienes permisos para actualizar este usuario.");
                    else if (err.response.status === 404) setError("Usuario no encontrado.");
                    else setError("Error al actualizar el usuario.");
                } else {
                    setError("Error de conexión con el servidor.");
                }
            });
    };

    if (error) {
        return (
            <div className="container mt-4">
                <h2>Error</h2>
                <p className="text-danger">{error}</p>
                <button className="btn btn-secondary" onClick={() => navigate('/perfil')}>Volver</button>
            </div>
        );
    }

    if (!usuario) return <p>Cargando usuario...</p>;

    return (
        <div className="container mt-4">
            <h2>Editar Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        value={usuario.nombre || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={usuario.email || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tipo</label>
                    <select
                        name="tipo"
                        className="form-select"
                        value={usuario.tipo || ''}
                        onChange={handleChange}
                    >
                        <option value="empleado">Empleado</option>
                        <option value="cliente">Cliente</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                        name="rol"
                        className="form-select"
                        value={usuario.rol || ''}
                        onChange={handleChange}
                    >
                        {roles.map(r => (
                            <option key={r._id} value={r._id}>{r.nombre}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Guardar cambios</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/perfil')}>Cancelar</button>
            </form>
        </div>
    );
}
