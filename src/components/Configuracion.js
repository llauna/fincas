// src/components/Configuracion.js
import React, { useState, useEffect } from 'react';
import Roles from './Roles/Roles';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Configuracion({ token }) {
    const rolUsuario = JSON.parse(localStorage.getItem('user'))?.rol || '';
    const [tabActiva, setTabActiva] = useState('roles');
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);

    const API_USUARIOS_URL = 'http://localhost:3001/api/usuarios';
    const API_ROLES_URL = 'http://localhost:3001/api/roles';

    if (rolUsuario !== 'Administrador') {
        return (
            <div className="container mt-4">
                <h2>Acceso denegado</h2>
                <p>Solo los usuarios con rol Administrador pueden acceder a esta sección.</p>
            </div>
        );
    }

    // Cargar usuarios y roles
    useEffect(() => {
        if (tabActiva === 'usuarios') {
            axios.get(API_USUARIOS_URL, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setUsuarios(res.data))
                .catch(err => console.error("❌ Error cargando usuarios:", err));

            axios.get(API_ROLES_URL, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setRoles(res.data))
                .catch(err => console.error("❌ Error cargando roles:", err));
        }
    }, [tabActiva, token]);

    // Cambiar rol de usuario
    const cambiarRol = (idUsuario, nuevoRol) => {
        axios.put(`${API_USUARIOS_URL}/${idUsuario}/rol`, { rol: nuevoRol }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert('✅ Rol actualizado correctamente');
                setUsuarios(usuarios.map(u => u._id === idUsuario ? { ...u, rol: roles.find(r => r._id === nuevoRol) } : u));
            })
            .catch(err => {
                console.error("❌ Error cambiando rol:", err);
                alert('Error al cambiar rol');
            });
    };

    return (
        <div className="container mt-4">
            <h2>Configuración del Sistema</h2>

            {/* Pestañas */}
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button
                        className={`nav-link ${tabActiva === 'roles' ? 'active' : ''}`}
                        onClick={() => setTabActiva('roles')}
                    >
                        Gestión de Roles
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${tabActiva === 'usuarios' ? 'active' : ''}`}
                        onClick={() => setTabActiva('usuarios')}
                    >
                        Asignar Roles a Usuarios
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${tabActiva === 'permisos' ? 'active' : ''}`}
                        onClick={() => setTabActiva('permisos')}
                    >
                        Permisos por Rol
                    </button>
                </li>
            </ul>

            {/* Contenido según pestaña */}
            <div className="mt-4">
                {tabActiva === 'roles' && <Roles token={token} />}

                {tabActiva === 'usuarios' && (
                    <div>
                        <h4>Asignar Roles a Usuarios</h4>
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol Actual</th>
                                <th>Nuevo Rol</th>
                                <th>Acción</th>
                            </tr>
                            </thead>
                            <tbody>
                            {usuarios.map(u => (
                                <tr key={u._id}>
                                    <td>{u.nombre}</td>
                                    <td>{u.email}</td>
                                    <td>{u.rol?.nombre || 'Sin rol'}</td>
                                    <td>
                                        <select
                                            className="form-select"
                                            defaultValue={u.rol?._id || ''}
                                            onChange={(e) => cambiarRol(u._id, e.target.value)}
                                        >
                                            <option value="">Seleccione un rol</option>
                                            {roles.map(r => (
                                                <option key={r._id} value={r._id}>{r.nombre}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => cambiarRol(u._id, u.rol?._id)}
                                        >
                                            Guardar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tabActiva === 'permisos' && (
                    <div>
                        <h4>Permisos por Rol</h4>
                        <p>En esta sección podrás definir qué vistas puede ver cada rol.</p>
                        {/* Aquí podemos integrar un editor de permisos */}
                    </div>
                )}
            </div>
        </div>
    );
}
