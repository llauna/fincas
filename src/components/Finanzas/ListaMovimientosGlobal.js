// src/components/Finanzas/ListaMovimientosGlobal.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL_MOVIMIENTOS_GLOBALES = 'http://localhost:3001/api/cajas/global'; // Ajusta puerto

const ListaMovimientosGlobal = () => {
    const navigate = useNavigate();
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovimientos = async () => {
            try {
                // NOTA: Asume que el backend ya ordena por fecha
                const res = await axios.get(API_URL_MOVIMIENTOS_GLOBALES);

                // 1. Calcular Saldo Acumulado (Running Balance)
                let saldoAcumulado = 0;
                const movimientosCalculados = res.data
                    .map(mov => {
                        const importe = parseFloat(mov.importe);
                        const ingreso = mov.tipo === 'Ingreso' ? importe : 0;
                        const gasto = mov.tipo === 'Gasto' ? importe : 0;

                        // Actualizar el saldo
                        saldoAcumulado += (ingreso - gasto);

                        return {
                            ...mov,
                            ingreso: ingreso.toFixed(2),
                            gasto: gasto.toFixed(2),
                            saldo: saldoAcumulado.toFixed(2) // Saldo acumulado hasta este punto
                        };
                    });

                setMovimientos(movimientosCalculados);
            } catch (error) {
                console.error('Error al obtener movimientos globales:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovimientos();
    }, []);

    const handleGoBack = () => {
        navigate('/caja');
    };

    // Calcular el Saldo Total Final
    const saldoTotal = movimientos.length > 0 ? movimientos[movimientos.length - 1].saldo : '0.00';

    if (loading) return <div className="container mt-4">Cargando movimientos...</div>;

    return (
        <div className="container mt-4">
            <h1 className="text-center">Movimientos Globales (Todas las Comunidades)</h1>

            <div className="alert alert-primary text-center my-4">
                Saldo Global Total: <strong>{saldoTotal} €</strong>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                <tr>
                    <th>Fecha</th>
                    <th>Comunidad</th>
                    <th>Concepto</th>
                    <th className="text-end">Ingreso (+)</th>
                    <th className="text-end">Gasto (-)</th>
                    <th className="text-end">Saldo</th>
                </tr>
                </thead>
                <tbody>
                {movimientos.map(mov => (
                    <tr key={mov._id}>
                        <td>{new Date(mov.fecha).toLocaleDateString()}</td>
                        <td>{mov.comunidadNombre || 'N/A'}</td> {/* Asume que el backend añade comunidadNombre */}
                        <td>{mov.concepto}</td>
                        {/* Se usan clases de Bootstrap 'text-end' para alinear números */}
                        <td className="text-end text-success">{mov.ingreso !== '0.00' ? mov.ingreso + ' €' : ''}</td>
                        <td className="text-end text-danger">{mov.gasto !== '0.00' ? mov.gasto + ' €' : ''}</td>
                        <td className="text-end fw-bold">{mov.saldo} €</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Botón volver */}
            <div className="text-center mt-4">
                <button onClick={handleGoBack} className="btn btn-secondary">Volver a Gestion Caja</button>
            </div>

        </div>
    );
};

export default ListaMovimientosGlobal;