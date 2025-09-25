// src/components/Finanzas/Bancos.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Función para formatear la cuenta bancaria
const formatCuenta = (value) => {
    // 1. Remove all non-alphanumeric characters (including spaces)
    const cleanedValue = value.replace(/[^a-zA-Z0-9]/g, '');

    // 2. Extrae solo la parte numérica y el "ES" si ya existe
    const numericPart = cleanedValue.replace(/[^0-9]/g, '');
    const hasES = cleanedValue.startsWith('ES') || cleanedValue.startsWith('es');

    // 3. Prepara el valor formateado. Si no tiene 'ES' aún, lo agrega.
    let formattedValue = hasES ? 'ES' : '';
    let remainingValue = hasES ? numericPart.substring(0) : numericPart;

    // Si el valor no tiene 'ES', lo añadimos y empezamos el formato
    if (!hasES && remainingValue) {
        formattedValue += 'ES';
    } else if (hasES && remainingValue) {
        // Si ya tiene 'ES', ajustamos el resto del valor
        remainingValue = numericPart;
    }

    // 4. Formatea la parte numérica con espacios
    for (let i = 0; i < remainingValue.length; i++) {
        // Añade un espacio cada 4 dígitos
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += remainingValue[i];
    }

    // 5. Limita la longitud a 29 caracteres
    return formattedValue.substring(0, 29);
};

const Bancos = () => {
    const navigate = useNavigate();
    const [bancos, setBancos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        nombreBanco: '',
        direccion: '',
        poblacion: '',
        cp: '',
        cuenta: ''
    });

    const API_URL = 'http://localhost:3001/api/bancos';

    const fetchBancos = async () => {
        try {
            const response = await axios.get(API_URL);
            setBancos(response.data);
        } catch (error) {
            console.error('Error al obtener los bancos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
        try {
            // ✅ CORRECCIÓN CLAVE: Limpiamos la cuenta de espacios y prefijos
            const cleanedCuenta = formData.cuenta.replace(/[^0-9A-Z]/g, '');

            const dataToSend = {
                ...formData,
                cuenta: cleanedCuenta
            };

            await axios.post(API_URL, dataToSend);

            setFormData({
                nombreBanco: '',
                direccion: '',
                poblacion: '',
                cp: '',
                cuenta: ''
            });

            fetchBancos();
        } catch (error) {
            console.error('Error al crear el banco:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchBancos();
        } catch (error) {
            console.error('Error al eliminar el banco:', error);
        }
    };

    const handleGoBack = () => {
        navigate('/dashboard');
    };

    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
    }

    return (
        <div className="container mt-4">
            <h1>Gestión de Bancos</h1>
            <div className="card my-4">
                <div className="card-header bg-dark text-white">
                    Registrar Nuevo Banco o Cuenta
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nombre del Banco</label>
                            <input type="text" className="form-control" name="nombreBanco" value={formData.nombreBanco} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Dirección</label>
                            <input type="text" className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} required />
                        </div>
                        <div className="row">
                            <div className="col-md-9 mb-3">
                                <label className="form-label">Población</label>
                                <input type="text" className="form-control" name="poblacion" value={formData.poblacion} onChange={handleChange} required />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Cod. Postal</label>
                                <input type="text" className="form-control" name="cp" value={formData.cp} onChange={handleChange} required maxLength="7" />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Número de Cuenta</label>
                            <input
                                type="text"
                                className="form-control"
                                name="cuenta"
                                value={formData.cuenta}
                                onChange={handleChange}
                                required
                                maxLength="29"
                            />
                        </div>
                        <button type="submit" className="btn btn-success me-2">
                            Guardar Banco
                        </button>
                    </form>
                </div>
            </div>
            <h2 className="mt-5">Listado de Bancos</h2>
            <div className="list-group">
                {bancos.map(banco => (
                    <div key={banco._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{banco.nombreBanco}</strong> - {banco.cuenta}
                        </div>
                        <div>
                            <Link to={`/bancos/${banco._id}`} className="btn btn-info btn-sm me-2">
                                Ver Movimientos
                            </Link>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(banco._id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={handleGoBack}
                className="btn btn-secondary mt-3"
            >
                Volver
            </button>
        </div>
    );
};

export default Bancos;