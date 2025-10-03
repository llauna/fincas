import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/usuarios';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('empleado');

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const res = await axios.get(API_URL);
                setUsuarios(res.data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsuarios();
    }, []);

    const handleRolChange = async (id, nuevoRol, nuevoTipo) => {
        try {
            await axios.put(`${API_URL}/${id}/rol`, { rol: nuevoRol, tipo: nuevoTipo });
            setUsuarios(prev =>
                prev.map(u => u._id === id ? { ...u, rol: nuevoRol, tipo: nuevoTipo } : u)
            );
        } catch (error) {
            console.error('Error al actualizar rol:', error);
        }
    };

    if (loading) return <div className="container mt-4">Cargando usuarios...</div>;

    const filtrados = usuarios.filter(u => u.tipo === tab);

    return (
        <div className="container mt-4">
            <h1>Gestión de Usuarios</h1>

            {/* Tabs */}
            <div className="mb-3">
                <button
                    className={`btn ${tab === 'empleado' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                    onClick={() => setTab('empleado')}
                >
                    Empleados
                </button>
                <button
                    className={`btn ${tab === 'cliente' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setTab('cliente')}
                >
                    Clientes
                </button>
            </div>

            {/* Tabla */}
            <table className="table table-bordered">
                <thead className="table-dark">
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {filtrados.map(u => (
                    <tr key={u._id}>
                        <td>{u.nombre}</td>
                        <td>{u.email}</td>
                        <td>
                            <select
                                value={u.rol}
                                onChange={(e) => handleRolChange(u._id, e.target.value, tab)}
                                className="form-select"
                            >
                                {tab === 'empleado' ? (
                                    <>
                                        <option value="admin">Admin</option>
                                        <option value="gestor">Gestor</option>
                                        <option value="contable">Contable</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="cliente">Cliente</option>
                                        <option value="propietario">Propietario</option>
                                        <option value="arrendatario">Arrendatario</option>
                                    </>
                                )}
                            </select>
                        </td>
                        <td>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => console.log('Eliminar usuario', u._id)}
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Botón volver */}
            <div className="text-center mt-4">
                <button onClick={handleGoBack} className="btn btn-secondary">Volver</button>
            </div>
        </div>
    );
};

export default GestionUsuarios;
