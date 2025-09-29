// src/components/Finanzas/Movimientos.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/movimientos';
const BANCO_URL = 'http://localhost:3001/api/bancos';

const Movimientos = () => {
    const { bancoId } = useParams();
    const navigate = useNavigate();
    const [movimientos, setMovimientos] = useState([]);
    const [banco, setBanco] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    // 🆕 Estado para manejar la edición
    const [editingId, setEditingId] = useState(null);

    const initialFormData = {
        fecha: '',
        descripcion: '',
        importe: '',
        tipo: 'Ingreso',
        banco: bancoId
    };

    const [formData, setFormData] = useState(initialFormData);

    // 🔹 Función para obtener token
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // 🔹 Obtener movimientos y datos del banco
    const fetchMovimientos = useCallback(async () => {
        try {
            setErrorMsg('');
            console.log("Banco ID recibido en Movimientos.js:", bancoId)
            // Asumiendo que tu backend devuelve los movimientos de un banco con esta ruta
            const movimientosRes = await axios.get(`${API_URL}/${bancoId}` );
            setMovimientos(movimientosRes.data);

            const bancoRes = await axios.get(`${BANCO_URL}/${bancoId}`);
            setBanco(bancoRes.data);
        } catch (error) {
            console.error('Error al obtener los movimientos:', error);
            if (error.response?.status === 401) {
                setErrorMsg('No autorizado. Inicia sesión para continuar.');
            } else {
                setErrorMsg('Error al obtener los datos.');
            }
        } finally {
            setLoading(false);
        }
    }, [bancoId]);

    useEffect(() => {
        if (bancoId) {
            fetchMovimientos();
        }
    }, [bancoId, fetchMovimientos]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // La fecha debe manejarse como string en el estado para el input type="date"
        const newValue = (type === 'number' || name === 'importe') ? parseFloat(value) : value;
        setFormData({ ...formData, [name]: newValue });
    };

    // 🆕 Función para iniciar la edición
    const handleEdit = (movimiento) => {
        // Formatear la fecha a 'YYYY-MM-DD' para el input de tipo 'date'
        const fechaFormateada = new Date(movimiento.fecha).toISOString().substring(0, 10);

        setFormData({
            fecha: fechaFormateada,
            descripcion: movimiento.descripcion,
            importe: movimiento.importe,
            tipo: movimiento.tipo,
            banco: movimiento.banco // Asegura que el ID del banco se mantenga
        });
        setEditingId(movimiento._id); // Guarda el ID del movimiento que se está editando
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // 🚀 Lógica de ACTUALIZACIÓN (Edición)
                await axios.put(`${API_URL}/${editingId}`, formData, { headers: getAuthHeaders() });
                setEditingId(null); // Limpiar el modo edición
            } else {
                // 🚀 Lógica de CREACIÓN (Nuevo Movimiento)
                await axios.post(API_URL, formData, { headers: getAuthHeaders() });
            }

            // Limpiar formulario y recargar datos
            setFormData(initialFormData);
            fetchMovimientos();
        } catch (error) {
            console.error('Error al guardar/actualizar el movimiento:', error);
            setErrorMsg('Error al guardar/actualizar el movimiento.');
        }
    };

    const handleDelete = async (id) => {
        try {
            // Asegúrate de limpiar el modo de edición si el movimiento que se está editando es eliminado
            if (editingId === id) {
                setEditingId(null);
                setFormData(initialFormData);
            }
            await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
            fetchMovimientos();
        } catch (error) {
            console.error('Error al eliminar el movimiento:', error);
            setErrorMsg('Error al eliminar el movimiento.');
        }
    };

    // 🆕 Función para cancelar la edición
    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(initialFormData);
    };


    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
    }

    if (!banco) {
        return <div className="container mt-4">No se encontró el banco.</div>;
    }

    return (
        <div className="container mt-4">
            <h1>Movimientos de Banco: {banco.nombreBanco}</h1>

            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            {/* Formulario para dar de alta/editar un movimiento */}
            <div className="card my-4">
                <div className={`card-header text-white ${editingId ? 'bg-primary' : 'bg-dark'}`}>
                    {editingId ? 'Editar Movimiento' : 'Registrar Nuevo Movimiento'}
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {/* ... campos del formulario (iguales) ... */}
                        <div className="mb-3">
                            <label className="form-label">Fecha</label>
                            <input type="date" className="form-control" name="fecha" value={formData.fecha} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <input type="text" className="form-control" name="descripcion" value={formData.descripcion} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Importe</label>
                            <input type="number" step="0.01" className="form-control" name="importe" value={formData.importe} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Tipo</label>
                            <select className="form-control" name="tipo" value={formData.tipo} onChange={handleChange} required>
                                <option value="Ingreso">Ingreso</option>
                                <option value="Gasto">Gasto</option>
                            </select>
                        </div>

                        {/* 🆕 Botones de acción dinámicos */}
                        <button type="submit" className={`btn ${editingId ? 'btn-primary' : 'btn-success'} me-2`}>
                            {editingId ? 'Actualizar Movimiento' : 'Guardar Movimiento'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancelEdit}
                            >
                                Cancelar Edición
                            </button>
                        )}

                    </form>
                </div>
            </div>

            {/* Tabla para mostrar y gestionar los movimientos */}
            <h2 className="mt-5">Historial de Movimientos</h2>
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Importe</th>
                    <th>Tipo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {movimientos.map(movimiento => (
                    <tr
                        key={movimiento._id}
                        // Resaltar el movimiento que se está editando
                        className={editingId === movimiento._id ? 'table-info' : ''}
                    >
                        <td>{new Date(movimiento.fecha).toLocaleDateString()}</td>
                        <td>{movimiento.descripcion}</td>
                        <td>{movimiento.importe}</td>
                        <td>{movimiento.tipo}</td>
                        <td>
                            {/* 🆕 Botón para iniciar la edición */}
                            <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => handleEdit(movimiento)}
                                disabled={editingId === movimiento._id} // Deshabilitar si ya se está editando
                            >
                                {editingId === movimiento._id ? 'Editando...' : 'Editar'}
                            </button>

                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(movimiento._id)}
                                disabled={editingId === movimiento._id} // Opcional: Deshabilitar eliminar al editar
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button
                onClick={() => navigate(-1)}
                className="btn btn-secondary mt-3"
            >
                Volver a la lista de bancos
            </button>
        </div>
    );
};

export default Movimientos;