import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProveedorFacturas = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [proveedor, setProveedor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [nuevaFactura, setNuevaFactura] = useState({
        numero: '',
        fecha: '',
        importe: '',
        concepto: ''
    });

    const API_URL = `http://localhost:3001/api/proveedores/${id}/facturas`;

    useEffect(() => {
        axios.get(`http://localhost:3001/api/proveedores/${id}`)
            .then(res => setProveedor(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const handleAddFactura = async (e) => {
        e.preventDefault();
        await axios.post(API_URL, nuevaFactura);
        const res = await axios.get(`http://localhost:3001/api/proveedores/${id}`);
        setProveedor(res.data);
        setShowModal(false);
        setNuevaFactura({ numero: '', fecha: '', importe: '', concepto: '' });
    };

    const handleDeleteFactura = async (facturaId) => {
        await axios.delete(`${API_URL}/${facturaId}`);
        const res = await axios.get(`http://localhost:3001/api/proveedores/${id}`);
        setProveedor(res.data);
    };

    if (!proveedor) return <div>Cargando...</div>;

    return (
        <div className="container mt-4">
            <h2>Facturas de {proveedor.nombre}</h2>
            <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>➕ Añadir Factura</button>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Número</th>
                    <th>Fecha</th>
                    <th>Importe</th>
                    <th>Concepto</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {proveedor.facturas.map(f => (
                    <tr key={f._id}>
                        <td>{f.numero}</td>
                        <td>{new Date(f.fecha).toLocaleDateString()}</td>
                        <td>{f.importe} €</td>
                        <td>{f.concepto}</td>
                        <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteFactura(f._id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Volver</button>

            {showModal && (
                <div className="modal fade show custom-modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Añadir Factura</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddFactura}>
                                    <input type="text" placeholder="Número" className="form-control mb-2" value={nuevaFactura.numero} onChange={e => setNuevaFactura({ ...nuevaFactura, numero: e.target.value })} required />
                                    <input type="date" className="form-control mb-2" value={nuevaFactura.fecha} onChange={e => setNuevaFactura({ ...nuevaFactura, fecha: e.target.value })} required />
                                    <input type="number" placeholder="Importe" className="form-control mb-2" value={nuevaFactura.importe} onChange={e => setNuevaFactura({ ...nuevaFactura, importe: e.target.value })} required />
                                    <input type="text" placeholder="Concepto" className="form-control mb-2" value={nuevaFactura.concepto} onChange={e => setNuevaFactura({ ...nuevaFactura, concepto: e.target.value })} required />
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

export default ProveedorFacturas;
