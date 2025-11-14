
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../../styles/ConfiguracionRoles.css';

function Roles({ token, onRolCreado }) {
    const [nuevoRol, setNuevoRol] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [rolesExistentes, setRolesExistentes] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Configuración global de Axios para incluir credenciales
    axios.defaults.withCredentials = true;

    const cargarRoles = useCallback(async () => {
        try {
            setCargando(true);
            const tokenLimpio = token.replace(/^['"]|['"]$/g, '');

            const config = {
                headers: {
                    'Authorization': `Bearer ${tokenLimpio}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            };

            const response = await axios.get('http://localhost:3001/api/roles', config);
            setRolesExistentes(response.data);
        } catch (error) {
            console.error('Error al cargar roles:', error);
            setMessage({
                text: 'Error al cargar los roles existentes',
                type: 'danger'
            });
        } finally {
            setCargando(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            console.error('No se proporcionó token al componente Roles');
            setMessage({
                text: 'Error de autenticación. Por favor, recarga la página o inicia sesión nuevamente.',
                type: 'danger'
            });
            setCargando(false);
            return;
        }

        cargarRoles();
    }, [token, cargarRoles]);

    const eliminarRol = async (rolId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este rol?')) {
            try {
                const tokenLimpio = token.replace(/^['"]|['"]$/g, '');
                await axios.delete(`http://localhost:3001/api/roles/${rolId}`, {
                    headers: {
                        'Authorization': `Bearer ${tokenLimpio}`,
                        'Content-Type': 'application/json'
                    }
                });
                await cargarRoles();
                setMessage({
                    text: 'Rol eliminado correctamente',
                    type: 'success'
                });
            } catch (error) {
                console.error('Error al eliminar rol:', error);
                setMessage({
                    text: 'Error al eliminar el rol',
                    type: 'danger'
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (!nuevoRol.trim()) {
            setMessage({
                text: 'Por favor ingresa un nombre para el nuevo rol',
                type: 'warning'
            });
            return;
        }

        if (rolesExistentes.some(rol =>
            rol.nombre.toLowerCase() === nuevoRol.trim().toLowerCase()
        )) {
            setMessage({
                text: `El rol "${nuevoRol}" ya existe`,
                type: 'warning'
            });
            return;
        }

        try {
            const tokenLimpio = token.replace(/^['"]|['"]$/g, '');
            await axios.post(
                'http://localhost:3001/api/roles',
                { nombre: nuevoRol.trim() },
                {
                    headers: {
                        'Authorization': `Bearer ${tokenLimpio}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setMessage({
                text: `✅ Rol "${nuevoRol}" creado exitosamente`,
                type: 'success'
            });

            setNuevoRol('');
            await cargarRoles();

            if (onRolCreado) {
                onRolCreado();
            }
        } catch (error) {
            console.error('Error al crear el rol:', error);
            setMessage({
                text: `Error al crear el rol: ${error.response?.data?.message || error.message}`,
                type: 'danger'
            });
        }
    };

    if (cargando) {
        return (
            <div className="container mt-4">
                <div className="alert alert-info">
                    Cargando roles...
                </div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    Error de autenticación. Por favor, recarga la página o inicia sesión nuevamente.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h3>Gestión de Roles</h3>

            <div className="card mt-3">
                <div className="card-header">
                    <h4>Crear Nuevo Rol</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nuevoRol" className="form-label">Nombre del Rol</label>
                            <input
                                type="text"
                                id="nuevoRol"
                                className="form-control"
                                value={nuevoRol}
                                onChange={(e) => setNuevoRol(e.target.value)}
                                placeholder="Escribe el nombre del nuevo rol"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Crear Rol
                        </button>
                    </form>
                </div>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type} mt-3`}>
                    {message.text}
                </div>
            )}

            <div className="card mt-4">
                <div className="card-header">
                    <h4>Roles Existentes</h4>
                </div>
                <div className="card-body">
                    {rolesExistentes.length > 0 ? (
                        <ul className="list-group">
                            {rolesExistentes.map(rol => (
                                <li key={rol._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {rol.nombre}
                                    <div>
                                        <span className="badge bg-primary rounded-pill me-2">
                                            {rol.permisos?.length || 0} permisos
                                        </span>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => eliminarRol(rol._id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay roles creados aún.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Roles;

