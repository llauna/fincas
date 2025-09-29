// src/components/Finanzas/Bancos.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/bancos.css'

// ✅ URL correcta del backend
const API_URL = 'http://localhost:3001/api/bancos';

// Función para formatear la cuenta bancaria (IBAN-like display)
const formatCuenta = (value) => {
    // 1. Limpieza de valor: solo letras y números, y mayúsculas
    const cleanedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    let formattedValue = '';
    // 2. Insertar un espacio cada 4 caracteres para mejorar la lectura del IBAN
    for (let i = 0; i < cleanedValue.length; i += 4) {
        formattedValue += cleanedValue.substring(i, i + 4) + ' ';
    }

    // 3. Quitar el espacio final y limitar a 29 caracteres (24 caracteres IBAN + 5 espacios)
    return formattedValue.trim().substring(0, 29);
};

const Bancos = () => {
    const navigate = useNavigate();
    const [bancos, setBancos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(''); // Errores de carga de lista
    const [showModal, setShowModal] = useState(false);
    const [formError, setFormError] = useState(''); // Errores de envío de formulario
    const [formData, setFormData] = useState({
        nombreBanco: '',
        direccion: '',
        poblacion: '',
        cp: '',
        cuenta: '',
        saldo: '', // Se enviará como string desde el input, se debe convertir
        descripcion: '',
        fecha: ''
    });

    useEffect(() => {
        const fetchBancos = async () => {
            try {
                const res = await axios.get(API_URL);
                setBancos(res.data);
            } catch (error) {
                console.error('Error al obtener los bancos:', error.response?.data || error.message);
                setErrorMsg('No se pudo obtener la lista de bancos');
            } finally {
                setLoading(false);
            }
        };
        fetchBancos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'cuenta') {
            const formattedValue = formatCuenta(value);
            setFormData({ ...formData, [name]: formattedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(''); // Limpiar errores previos del formulario
        setErrorMsg(''); // Limpiar errores de carga si existieran

        try {
            const cleanedCuenta = formData.cuenta.replace(/[^0-9A-Z]/g, '');

            // 💡 FIX 1A: Asegurar que el saldo se envía como número
            const dataToSend = {
                ...formData,
                cuenta: cleanedCuenta,
                saldo: parseFloat(formData.saldo) || 0
            };

            const res = await axios.post(API_URL, dataToSend);

            // 💡 FIX 1B: Actualizar el estado con el nuevo banco (para actualización reactiva)
            setBancos(prevBancos => [...prevBancos, res.data]);

            // Limpiar el formulario
            setFormData({
                nombreBanco: '',
                direccion: '',
                poblacion: '',
                cp: '',
                cuenta: '',
                saldo: '',
                descripcion: '',
                fecha: ''
            });
            setShowModal(false); // cerrar modal al guardar

        } catch (error) {
            console.error('Error al crear el banco:', error.response?.data || error.message);
            setFormError(error.response?.data?.message || 'Error al crear el banco. Verifica los campos.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);

            // 💡 FIX 2: Usar '_id' (clave primaria de MongoDB) para filtrar la lista.
            setBancos(prevBancos => prevBancos.filter(banco => banco._id !== id));

        } catch (error) {
            console.error('Error al eliminar el banco:', error.response?.data || error.message);
        }
    };

    const handleGoBack = () => {
        navigate('/dashboard');
    };

    if (loading) {
        return <div className="text-center py-5">Cargando...</div>;
    }
    // Si hay error de carga inicial, lo mostramos fuera del cuerpo principal
    if (errorMsg) return <div className="container mt-4 alert alert-danger">{errorMsg}</div>

    return (
        <div className="container py-4">
            <h1 className="mb-4 text-center">Gestión de Bancos</h1>

            {/* Botón para abrir modal */}
            <div className="text-center mb-4">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Registrar Nuevo Banco
                </button>
            </div>

            {/* Fondo oscuro */}
            {showModal && <div className="custom-modal-backdrop" onClick={() => setShowModal(false)}></div>}

            {/* Modal con animación */}
            {showModal && (
                <div className="modal fade show custom-modal" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Registrar Nuevo Banco</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {/* 💡 FIX 3: Mostrar el error del formulario, no el error de carga inicial */}
                                {formError && <div className="alert alert-danger">{formError}</div>}
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="nombreBanco" className="form-label">Nombre del Banco</label>
                                            <input type="text" className="form-control" id="nombreBanco" name="nombreBanco" value={formData.nombreBanco} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="direccion" className="form-label">Dirección</label>
                                            <input type="text" className="form-control" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-8 mb-3">
                                            <label htmlFor="poblacion" className="form-label">Población</label>
                                            <input type="text" className="form-control" id="poblacion" name="poblacion" value={formData.poblacion} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="cp" className="form-label">Código Postal</label>
                                            <input type="text" className="form-control input-small" id="cp" name="cp" value={formData.cp} onChange={handleChange} required maxLength="7" />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-8 mb-3">
                                            <label htmlFor="cuenta" className="form-label">Número de Cuenta (IBAN)</label>
                                            <input type="text" className="form-control" id="cuenta" name="cuenta" value={formData.cuenta} onChange={handleChange} required maxLength="29" />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="saldo" className="form-label">Saldo inicial</label>
                                            <input type="number" className="form-control" id="saldo" name="saldo" value={formData.saldo} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-8 mb-3">
                                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                                            <input type="text" className="form-control" id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="fecha" className="form-label">Fecha</label>
                                            <input type="date" className="form-control" id="fecha" name="fecha" value={formData.fecha} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-primary">💾 Guardar Banco</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Listado de Bancos */}
            <h2 className="mb-3 text-center">Listado de Bancos</h2>
            <div className="listado-bancos">
                <div className="row">
                    {bancos.map(banco => (
                        <div key={banco._id} className="col-12 col-md-6 mb-3">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{banco.nombreBanco}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{formatCuenta(banco.cuenta)}</h6>
                                    <p className="card-text">{banco.direccion}, {banco.poblacion} ({banco.cp})</p>
                                    <p className="card-text"><strong>Saldo:</strong> ${parseFloat(banco.saldo).toFixed(2)}</p>
                                    <p className="card-text"><strong>Descripción:</strong> {banco.descripcion}</p>
                                    <p className="card-text"><strong>Fecha:</strong> {new Date(banco.fecha).toLocaleDateString()}</p>
                                </div>
                                <div className="card-footer d-flex justify-content-between">
                                    <Link to={`/movimientos/${banco._id}`} className="btn btn-outline-primary btn-sm">Ver Movimientos</Link>
                                    <button onClick={() => handleDelete(banco._id)} className="btn btn-outline-danger btn-sm">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Botón volver */}
            <div className="text-center mt-4">
                <button onClick={handleGoBack} className="btn btn-secondary">Volver</button>
            </div>
        </div>
    );
};

export default Bancos;
