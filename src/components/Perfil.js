// src/components/Perfil.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Perfil({ token }) {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3001/api/usuarios', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                console.log("Usuarios recibidos:",data);
                if (Array.isArray(data)) {
                    setUsuarios(data);
                } else {
                    console.error("La API no devolvió un array:", data);
                    setUsuarios([]);
                }
            })
            .catch(err => console.error(err));
    }, [token]);

    const eliminarUsuario = (id) => {
        if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
            fetch(`http://localhost:3001/api/usuarios/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(() => setUsuarios(usuarios.filter(u => u._id !== id)));
        }
    };

    return (
        <div className="container mt-4">
            <h2>Administración de Usuarios</h2>
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
            <button className="btn btn-secondary mt-3" onClick={() => navigate('/dashboard')}>Volver</button>
        </div>
    );
}
