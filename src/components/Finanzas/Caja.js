// src/components/Finanzas/Caja.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL_CAJAS = 'http://localhost:3001/api/cajas';
const API_URL_COMUNIDADES = 'http://localhost:3001/api/comunidades';

const Caja = () => {
    const { comunidadId } = useParams();
    const navigate = useNavigate();

    const [movimientos, setMovimientos] = useState([]);
    const [comunidades, setComunidades] = useState([]);
    const [selectedComunidadId, setSelectedComunidadId] = useState(comunidadId || '');
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fecha: '',
        concepto: '',
        importe: '',
        tipo: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [formError, setFormError] = useState('');

    const fetchComunidades = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No se encontró el token de autenticación');
                return;
            }
            
            console.log('Fetching comunidades from:', API_URL_COMUNIDADES);
            const res = await axios.get(API_URL_COMUNIDADES, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Comunidades recibidas:', res.data);
            setComunidades(res.data);
        } catch (error) {
            console.error('Error al obtener comunidades:', error);
            console.error('Error details:', error.response?.data);
            if (error.response?.status === 401) {
                // Token inválido o expirado, redirigir al login
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
    }, []);

    const fetchMovimientos = useCallback(async () => {
        if (!selectedComunidadId || selectedComunidadId.length !== 24) {
            setMovimientos([]);
            setLoading(false);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No se encontró el token de autenticación');
                return;
            }
            
            const response = await axios.get(`${API_URL_CAJAS}/comunidad/${selectedComunidadId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setMovimientos(response.data);
        } catch (error) {
            console.error('Error al obtener los movimientos de caja:', error);
            if (error.response?.status === 401) {
                // Token inválido o expirado, redirigir al login
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    }, [selectedComunidadId]);

    useEffect(() => {
        fetchComunidades();
    }, [fetchComunidades]);

    useEffect(() => {
        fetchMovimientos();
    }, [fetchMovimientos]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!formData.fecha || !formData.concepto || !formData.importe || !formData.tipo || !selectedComunidadId) {
            setFormError('❌ Todos los campos y la comunidad son obligatorios.');
            return;
        }

        try {
            await axios.post(API_URL_CAJAS, {
                ...formData,
                comunidadId: selectedComunidadId
            });

            setFormData({ fecha: '', concepto: '', importe: '', tipo: '' });
            setShowModal(false);
            fetchMovimientos();
        } catch (error) {
            console.error('Error al guardar el movimiento de caja:', error);
            const serverError = error.response?.data?.message || 'Error al guardar el movimiento.';
            setFormError(serverError);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL_CAJAS}/${id}`);
            fetchMovimientos();
        } catch (error) {
            console.error('Error al eliminar el movimiento de caja:', error);
        }
    };

    const handleGoBack = () => {
        // Cerrar cualquier modal abierto
        setShowModal(false);
        // Navegar directamente al dashboard
        navigate('/dashboard', { replace: true });
    };

    const calcularSaldo = () => {
        return movimientos.reduce((total, mov) => {
            const importe = parseFloat(mov.importe);
            return mov.tipo === 'Ingreso' ? total + importe : total - importe;
        }, 0).toFixed(2);
    };

    if (loading) return <div className="container mt-4">Cargando...</div>;

    return (
        <div className="container mt-4">
            <h1 className="text-center">Gestión de Caja</h1>

            {/* Selector de comunidad */}
            <div className="mb-3">
                <label className="form-label">Seleccionar Comunidad</label>
                <select
                    className="form-select"
                    value={selectedComunidadId}
                    onChange={(e) => setSelectedComunidadId(e.target.value)}
                >
                    <option value="">-- Seleccione una comunidad --</option>
                    {Array.isArray(comunidades) && comunidades.length > 0 ? (
                        comunidades.map(c => (
                            <option key={c._id} value={c._id}>{c.nombre || `Comunidad sin nombre (${c._id})`}</option>
                        ))
                    ) : (
                        <option disabled>No hay comunidades disponibles</option>
                    )}
                </select>
            </div>

            {/* Botones de acción */}
            <div className="text-center mb-4">
                <button className="btn btn-success me-2" onClick={() => setShowModal(true)}>
                    💰 Registrar Nuevo Movimiento
                </button>
                <button
                    className="btn btn-warning"
                    onClick={() => navigate('/movimientos-globales')}
                >
                    📋 Ver Movimientos Globales
                </button>
            </div>

            <div className="alert alert-info text-center">
                Saldo Actual: <strong>{calcularSaldo()} €</strong>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">Registrar Nuevo Movimiento</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {formError && <div className="alert alert-danger">{formError}</div>}
                                <form onSubmit={handleSubmit}>
                                    <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="form-control mb-2" />
                                    <input type="text" name="concepto" value={formData.concepto} onChange={handleChange} className="form-control mb-2" placeholder="Concepto" />
                                    <input type="number" step="0.01" name="importe" value={formData.importe} onChange={handleChange} className="form-control mb-2" placeholder="Importe" />
                                    <select name="tipo" value={formData.tipo} onChange={handleChange} className="form-control mb-2">
                                        <option value="">Seleccione...</option>
                                        <option value="Ingreso">Ingreso</option>
                                        <option value="Gasto">Gasto</option>
                                    </select>
                                    <button type="submit" className="btn btn-success">💾 Guardar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla */}
            <h2 className="mt-5">Listado de Movimientos</h2>
            <table className="table table-bordered">
                <thead className="table-dark">
                <tr>
                    <th>Fecha</th>
                    <th>Concepto</th>
                    <th>Importe</th>
                    <th>Tipo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {movimientos.map(mov => (
                    <tr key={mov._id} className={mov.tipo === 'Ingreso' ? 'table-success' : 'table-danger'}>
                        <td>{new Date(mov.fecha).toLocaleDateString()}</td>
                        <td>{mov.concepto}</td>
                        <td>{parseFloat(mov.importe).toFixed(2)} €</td>
                        <td>{mov.tipo}</td>
                        <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(mov._id)}>Eliminar</button>
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

export default Caja;
