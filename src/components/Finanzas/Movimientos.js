// src/components/Finanzas/Movimientos.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Movimientos = () => {
    const { bancoId } = useParams();
    const navigate = useNavigate();
    const [movimientos, setMovimientos] = useState([]);
    const [banco, setBanco] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fecha: '',
        descripcion: '',
        importe: '',
        tipo: 'Ingreso',
        banco: bancoId
    });

    const API_URL = 'http://localhost:3001/api/movimientos';

    const fetchMovimientos = async () => {
        try {
            const movimientosRes = await axios.get(`${API_URL}/${bancoId}`);
            setMovimientos(movimientosRes.data);
            const bancoRes = await axios.get(`http://localhost:3001/api/bancos/${bancoId}`);
            setBanco(bancoRes.data);
        } catch (error) {
            console.error('Error al obtener los movimientos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bancoId) {
            fetchMovimientos();
        }
    }, [bancoId]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' ? parseFloat(value) : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, formData);
            setFormData({
                fecha: '',
                descripcion: '',
                importe: '',
                tipo: 'Ingreso',
                banco: bancoId
            });
            fetchMovimientos();
        } catch (error) {
            console.error('Error al guardar el movimiento:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchMovimientos();
        } catch (error) {
            console.error('Error al eliminar el movimiento:', error);
        }
    };

    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
    }

    if (!banco) {
        return <div className="container mt-4">No se encontró el banco.</div>;
    }

    return (
        <div className="container mt-4">
            <h1>Movimientos de Banco: {banco.nombre}</h1>

            {/* Formulario para dar de alta un movimiento */}
            <div className="card my-4">
                <div className="card-header bg-dark text-white">
                    Registrar Nuevo Movimiento
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit" className="btn btn-success">
                            Guardar Movimiento
                        </button>
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
                    <tr key={movimiento._id}>
                        <td>{new Date(movimiento.fecha).toLocaleDateString()}</td>
                        <td>{movimiento.descripcion}</td>
                        <td>{movimiento.importe}</td>
                        <td>{movimiento.tipo}</td>
                        <td>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(movimiento._id)}
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