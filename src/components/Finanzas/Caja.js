import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Caja = () => {
    const navigate = useNavigate();
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fecha: '',
        concepto: '',
        importe: '',
        tipo: '', // 'Ingreso' o 'Gasto'
    });

    const API_URL = 'http://localhost:3001/api/caja';

    const fetchMovimientos = async () => {
        try {
            const response = await axios.get(API_URL);
            setMovimientos(response.data);
        } catch (error) {
            console.error('Error al obtener los movimientos de caja:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovimientos();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, formData);
            setFormData({ fecha: '', concepto: '', importe: '', tipo: '' });
            fetchMovimientos();
        } catch (error) {
            console.error('Error al guardar el movimiento de caja:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchMovimientos();
        } catch (error) {
            console.error('Error al eliminar el movimiento de caja:', error);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
    }

    return (
        <div className="container mt-4">
            <h1>Gestión de Caja</h1>

            {/* Formulario para dar de alta */}
            <div className="card my-4">
                <div className="card-header bg-dark text-white">
                    Registrar Nuevo Movimiento de Caja
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Fecha</label>
                            <input type="date" className="form-control" name="fecha" value={formData.fecha} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Concepto</label>
                            <input type="text" className="form-control" name="concepto" value={formData.concepto} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Importe</label>
                            <input type="number" step="0.01" className="form-control" name="importe" value={formData.importe} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Tipo</label>
                            <select className="form-control" name="tipo" value={formData.tipo} onChange={handleChange} required>
                                <option value="">Seleccione...</option>
                                <option value="Ingreso">Ingreso</option>
                                <option value="Gasto">Gasto</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-success me-2">
                            Guardar
                        </button>
                    </form>
                </div>
            </div>

            {/* Tabla para mostrar y gestionar */}
            <h2 className="mt-5">Listado de Movimientos de Caja</h2>
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Concepto</th>
                    <th>Importe</th>
                    <th>Tipo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {movimientos.map(movimiento => (
                    <tr key={movimiento._id}>
                        <td>{new Date(movimiento.fecha).toLocaleDateString()}</td>
                        <td>{movimiento.concepto}</td>
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
                onClick={handleGoBack}
                className="btn btn-secondary mt-3"
            >
                Volver
            </button>
        </div>
    );
};

export default Caja;