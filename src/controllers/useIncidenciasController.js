// useIncidenciasController.js
import { useState, useEffect } from 'react';
import { obtenerIncidencias } from '../services/incidenciasService';

export function useIncidenciasController(userRole, userEmail, propietarioId, navigate) {
    const [incidencias, setIncidencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔹 Estados para paginación y filtrado
    const [paginaActual, setPaginaActual] = useState(1);
    const [itemsPorPagina] = useState(5);
    const [filtroTexto, setFiltroTexto] = useState('');

    useEffect(() => {
        async function cargar() {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));

                if (!token || !user) {
                    throw new Error('No se encontró la información de autenticación. Por favor, inicie sesión nuevamente.');
                }

                const data = await obtenerIncidencias(token);

                let filtradas = data;
                if (userRole !== 'Administrador') {
                    filtradas = data.filter(inc => inc.reportadoPor?.contacto?.toLowerCase() === userEmail);
                }

                setIncidencias(filtradas);
                setError(null);
            } catch (err) {
                setError(err.message);
                if (err.message.includes('Token')) {
                    localStorage.clear();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        }
        cargar();
    }, [userRole, userEmail, propietarioId, navigate]);

    // 🔹 Filtrado por texto
    const incidenciasFiltradas = incidencias.filter(inc =>
        inc.titulo?.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        inc.descripcionDetallada?.toLowerCase().includes(filtroTexto.toLowerCase())
    );

    // 🔹 Paginación
    const indiceInicio = (paginaActual - 1) * itemsPorPagina;
    const indiceFin = indiceInicio + itemsPorPagina;
    const incidenciasPaginadas = incidenciasFiltradas.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(incidenciasFiltradas.length / itemsPorPagina);

    return {
        incidencias: incidenciasPaginadas,
        loading,
        error,
        recargar: () => window.location.reload(),
        paginaActual,
        setPaginaActual,
        totalPaginas,
        filtroTexto,
        setFiltroTexto
    };
}
