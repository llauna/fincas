// src/components/Finanzas/ListaCajas.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// NOTA: Esta API URL debe apuntar a '/saldos' para obtener los saldos agrupados,
// no a '/global', que es para la lista de movimientos completos.
const API_URL_SALDOS = 'http://localhost:3001/api/cajas/saldos';

// El componente NO debe ser ASYNC
const ListaCajas = () => {
    // 1. Hooks en el nivel superior de la función del componente
    const [saldos, setSaldos] = useState([]);
    const [loading, setLoading] = useState(true); // <- Reinsertamos el estado de carga
    const navigate = useNavigate();
    const location = useLocation();

    // 2. useEffect para cargar los saldos
    useEffect(() => {
        const fetchSaldos = async () => {
            try {
                // NOTA: Si usas la URL '/global', deberías usar la lógica de LISTAMOVIMIENTOSGLOBAL.JS aquí
                // Asumiendo que el endpoint ES '/saldos' para esta vista:
                const res = await axios.get(API_URL_SALDOS);
                setSaldos(res.data);
            } catch (error) {
                console.error('Error al obtener saldos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSaldos();
        // Añadimos setLoading a las dependencias para cumplir con ESLint (buenas prácticas)
    }, [setLoading]);

    // Restaurar posición de scroll (correcta)
    useEffect(() => {
        if (location.state?.scrollY) {
            window.scrollTo(0, location.state.scrollY);
        }
    }, [location.state]);

    // Lógica de carga, ahora funcional
    if (loading) return <div className="container mt-4">Cargando saldos...</div>;

    return (
        <div className="container mt-4">
            <h1 className="text-center">Saldos de Todas las Cajas</h1>

            {/* El botón ahora se renderizará porque la estructura es correcta */}
            <div className="mb-3 text-end">
                <button
                    className="btn btn-warning" // Agrega las clases de Bootstrap aquí si las necesitas
                    onClick={() => navigate('/movimientos-globales')}
                >
                    📋 Ver todos los movimientos
                </button>
            </div>

            <table className="table table-bordered">
                <thead className="table-dark">
                <tr>
                    <th>Comunidad</th>
                    <th>Saldo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {saldos.map(s => (
                    // Asegúrate de que 's' tenga un comunidadId único
                    <tr key={s.comunidadId} className={s.saldo >= 0 ? 'table-success' : 'table-danger'}>
                        <td>{s.comunidadNombre}</td>
                        <td>{parseFloat(s.saldo).toFixed(2)} €</td>
                        <td>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => navigate(`/caja/comunidad/${s.comunidadId}`, {
                                    state: { from: '/lista-cajas', scrollY: window.scrollY }
                                })}
                            >
                                Ver movimientos
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaCajas;
