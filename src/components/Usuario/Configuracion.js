// src/components/Configuracion.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Roles from './../Roles/Roles';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Configuracion({ token }) {
    const navigate = useNavigate();
    const rolUsuario = JSON.parse(localStorage.getItem('user'))?.rol || '';
    const [tabActiva, setTabActiva] = useState('roles');
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [usuariosCargados, setUsuariosCargados] = useState(false);
    const [rolesCargados, setRolesCargados] = useState(false);

    const API_USUARIOS_URL = 'http://localhost:3001/api/usuarios';
    const API_ROLES_URL = 'http://localhost:3001/api/roles';

    // ✅ useEffect siempre se llama, pero solo carga datos si es necesario
    useEffect(() => {
        if (tabActiva === 'usuarios' && !usuariosCargados) {
            axios.get(API_USUARIOS_URL, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setUsuarios(res.data);
                    setUsuariosCargados(true);
                })
                .catch(err => console.error("❌ Error cargando usuarios:", err));
        }

        if ((tabActiva === 'usuarios' || tabActiva === 'permisos') && !rolesCargados) {
            axios.get(API_ROLES_URL, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setRoles(res.data);
                    setRolesCargados(true);
                })
                .catch(err => console.error("❌ Error cargando roles:", err));
        }
    }, [tabActiva, token, usuariosCargados, rolesCargados]);

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

    const handleGoBack = () => {
        navigate(-1);
    };

    // ✅ El return condicional va después de los hooks
    if (rolUsuario !== 'Administrador') {
        return (
            <div className="container mt-4">
                <h2>Acceso denegado</h2>
                <p>Solo los usuarios con rol Administrador pueden acceder a esta sección.</p>
            </div>
        );
    }

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
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th>Rol</th>
                                <th>Permisos</th>
                                <th>Acción</th>
                            </tr>
                            </thead>
                            <tbody>
                            {roles.map(rol => (
                                <tr key={rol._id}>
                                    <td>{rol.nombre}</td>
                                    <td>
                                        {["perfil", "configuracion", "dashboard", "reportes"].map(vista => (
                                            <div key={vista} className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={rol.permisos?.includes(vista)}
                                                    onChange={(e) => {
                                                        const nuevosPermisos = e.target.checked
                                                            ? [...(rol.permisos || []), vista]
                                                            : (rol.permisos || []).filter(p => p !== vista);
                                                        setRoles(roles.map(r =>
                                                            r._id === rol._id ? { ...r, permisos: nuevosPermisos } : r
                                                        ));
                                                    }}
                                                />
                                                <label className="form-check-label">{vista}</label>
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => {
                                                axios.put(`${API_ROLES_URL}/${rol._id}/permisos`, { permisos: rol.permisos }, {
                                                    headers: { Authorization: `Bearer ${token}` }
                                                })
                                                    .then(() => alert('✅ Permisos actualizados'))
                                                    .catch(err => {
                                                        console.error("❌ Error actualizando permisos:", err);
                                                        alert('Error al actualizar permisos');
                                                    });
                                            }}
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
            </div>

            {/* Botón volver */}
            <div className="text-center mt-4">
                <br />
                <button onClick={handleGoBack} className="btn btn-secondary">Volver</button>
            </div>
        </div>
    );
}
