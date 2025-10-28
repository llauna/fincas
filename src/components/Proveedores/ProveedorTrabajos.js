// src/components/Proveedores/ProveedorTrabajos.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProveedorTrabajos = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [proveedor, setProveedor] = useState(null);
    const [comunidades, setComunidades] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        descripcion: '',
        comunidad: '',
        fechaSolicitud: new Date().toISOString().split('T')[0],
        estado: 'Pendiente',
        facturaAsociada: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token'); // Obtén el token desde el almacenamiento local
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}` // Incluye el token en el encabezado
                    }
                };
                const [proveedorRes, comunidadesRes] = await Promise.all([
                    axios.get(`http://localhost:3001/api/proveedores/${id}`, config), // URL correcta para proveedores
                    axios.get('http://localhost:3001/api/comunidades', config) // URL correcta para comunidades
                ]);
                setProveedor(proveedorRes.data);
                setComunidades(comunidadesRes.data);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };
        fetchData();
    }, [id]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Datos enviados:', formData);
            const token = localStorage.getItem('token'); // Obtén el token desde el almacenamiento local
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` // Incluye el token en el encabezado
                }
            };
            await axios.post(`http://localhost:3001/api/proveedores/${id}/trabajos`, formData, config);
            // Actualizar la lista de trabajos
            const res = await axios.get(`http://localhost:3001/api/proveedores/${id}`);
            setProveedor(res.data);
            setShowModal(false);
        } catch (error) {
            console.error('Error al guardar trabajo:', error);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (!proveedor) return <div>Cargando...</div>;

    return (
        <div className="container mt-4">
            <h2>Trabajos de {proveedor.nombre}</h2>
            <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
                ➕ Nuevo Trabajo
            </button>

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Descripción</th>
                    <th>Comunidad</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Factura</th>
                </tr>
                </thead>
                <tbody>
                {proveedor.trabajos?.map((trabajo, index) => (
                    <tr key={index}>
                        <td>{trabajo.descripcion}</td>
                        <td>{trabajo.comunidad?.nombre || 'N/A'}</td>
                        <td>{new Date(trabajo.fechaSolicitud).toLocaleDateString()}</td>
                        <td>{trabajo.estado}</td>
                        <td>
                            {trabajo.facturaAsociada
                                ? `Factura #${trabajo.facturaAsociada.numero}`
                                : 'Sin factura'}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button onClick={handleGoBack} className="btn btn-secondary mt-3">Volver</button>

            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nuevo Trabajo</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Descripción</label>
                                        <textarea
                                            className="form-control"
                                            name="descripcion"
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Comunidad</label>
                                        <select
                                            className="form-select"
                                            name="comunidad"
                                            value={formData.comunidad}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccione una comunidad</option>
                                            {comunidades.map(comunidad => (
                                                <option key={comunidad._id} value={comunidad._id}>
                                                    {comunidad.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Fecha de Solicitud</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="fechaSolicitud"
                                            value={formData.fechaSolicitud}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Guardar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProveedorTrabajos;