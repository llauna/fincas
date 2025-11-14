
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConfiguracionRoles.css';

function ConfiguracionRoles() {
    const [roles, setRoles] = useState([]);
    const [nuevoRol, setNuevoRol] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarRoles();
    }, []);

    const cargarRoles = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/roles', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setRoles(response.data);
        } catch (error) {
            setError('Error al cargar los roles');
            console.error('Error:', error);
        }
    };

    const crearRol = async (e) => {
        e.preventDefault();
        if (!nuevoRol.trim()) {
            setError('El nombre del rol no puede estar vacío');
            return;
        }

        try {
            await axios.post('http://localhost:3001/api/roles',
                {
                    nombre: nuevoRol,
                    permisos: [] // Permisos iniciales vacíos
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setNuevoRol('');
            cargarRoles();
            setError(null);
        } catch (error) {
            setError('Error al crear el rol');
            console.error('Error:', error);
        }
    };

    const eliminarRol = async (rolId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este rol?')) {
            try {
                await axios.delete(`http://localhost:3001/api/roles/${rolId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                cargarRoles();
            } catch (error) {
                setError('Error al eliminar el rol');
                console.error('Error:', error);
            }
        }
    };

    return (
        <div className="configuracion-roles">
            <h2>Gestión de Roles</h2>

            {/* Formulario para crear nuevo rol */}
            <div className="crear-rol">
                <h3>Crear Nuevo Rol</h3>
                <form onSubmit={crearRol}>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Escribe el nombre del nuevo rol"
                            value={nuevoRol}
                            onChange={(e) => setNuevoRol(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Crear Rol
                        </button>
                    </div>
                </form>
            </div>

            {/* Mostrar mensaje de error si existe */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Lista de roles existentes */}
            <div className="roles-existentes">
                <h3>Roles Existentes</h3>
                <div className="list-group">
                    {roles.map((rol) => (
                        <div key={rol._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>{rol.nombre}</span>
                            <span className="badge bg-primary rounded-pill">
                                {rol.permisos ? rol.permisos.length : 0} permisos
                            </span>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => eliminarRol(rol._id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ConfiguracionRoles;