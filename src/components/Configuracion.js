// src/components/Configuracion
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePerfil from '../../src/hooks/usePerfil';

export default function Configuracion({ token }) {
    const { perfil, loading } = usePerfil(token);
    const [roles, setRoles] = useState([]);
    const [rolSeleccionado, setRolSeleccionado] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3001/api/roles', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setRoles(data))
            .catch(err => console.error(err));
    }, [token]);

    const cambiarRol = () => {
        fetch(`http://localhost:3001/api/usuarios/${perfil._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ rol: rolSeleccionado })
        })
            .then(res => res.json())
            .then(() => alert('Rol actualizado correctamente'));
    };

    if (loading) return <p>Cargando configuración...</p>;
    if (!perfil) return <p>No se encontró el perfil.</p>;

    return (
        <div className="container mt-4">
            <h2>Configuración de Usuario</h2>
            <p><strong>Nombre:</strong> {perfil.nombre}</p>
            <p><strong>Email:</strong> {perfil.email}</p>
            <p><strong>Tipo:</strong> {perfil.tipo}</p>
            <p><strong>Rol actual:</strong> {perfil.rol}</p>

            <div className="mt-3">
                <label>Asignar nuevo rol:</label>
                <select
                    className="form-select"
                    value={rolSeleccionado}
                    onChange={(e) => setRolSeleccionado(e.target.value)}
                >
                    <option value="">Selecciona un rol</option>
                    {roles.map(r => (
                        <option key={r._id} value={r._id}>{r.nombre}</option>
                    ))}
                </select>
                <button className="btn btn-primary mt-2" onClick={cambiarRol}>Guardar</button>
            </div>

            <button className="btn btn-secondary mt-3" onClick={() => navigate('/dashboard')}>Volver</button>
        </div>
    );
}

