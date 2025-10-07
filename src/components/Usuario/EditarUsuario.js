import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditarUsuario({ token }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        // Obtener datos del usuario
        fetch(`http://localhost:3001/api/usuarios/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setUsuario(data))
            .catch(err => console.error(err));

        // Obtener lista de roles
        fetch('http://localhost:3001/api/roles', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setRoles(data))
            .catch(err => console.error(err));
    }, [id, token]);

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:3001/api/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(usuario)
        })
            .then(res => res.json())
            .then(() => {
                alert('Usuario actualizado correctamente');
                navigate('/perfil');
            })
            .catch(err => console.error(err));
    };

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
                        value={usuario.rol?._id || ''}
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
