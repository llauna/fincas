import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ConfiguracionRoles({ token }) {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        cargarUsuarios();
        cargarRoles();
    }, [token]);

    const cargarUsuarios = () => {
        axios.get('http://localhost:3001/api/usuarios', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setUsuarios(res.data))
            .catch(err => console.error(err));
    };

    const cargarRoles = () => {
        axios.get('http://localhost:3001/api/roles', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setRoles(res.data))
            .catch(err => console.error(err));
    };

    const cambiarRol = (id, nuevoRol) => {
        axios.put(`http://localhost:3001/api/usuarios/${id}/rol`, { rol: nuevoRol }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert('Rol actualizado correctamente');
                cargarUsuarios();
            })
            .catch(err => {
                console.error(err);
                alert('Error al actualizar rol');
            });
    };

    return (
        <div className="container mt-4">
            <h2>Gestión de Roles</h2>
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
                            <select
                                value={u.rol?._id || ''}
                                onChange={(e) => cambiarRol(u._id, e.target.value)}
                                className="form-select"
                            >
                                {roles.map(r => (
                                    <option key={r._id} value={r._id}>{r.nombre}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
