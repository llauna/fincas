import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ListaIncidencias() {
    const navigate = useNavigate();
    const { propietarioId } = useParams(); // Obtener el propietarioId desde la URL
    const [incidencias, setIncidencias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIncidencias = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/incidencias/propietario/${propietarioId}`);
                const data = await res.json();
                setIncidencias(data);
            } catch (error) {
                console.error('Error al obtener las incidencias:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchIncidencias();
    }, [propietarioId]);

    if (loading) {
        return <p>Cargando incidencias...</p>;
    }

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <h2>Lista de Incidencias</h2>
            {incidencias.length > 0 ? (
                <ul>
                    {incidencias.map((incidencia) => (
                        <li key={incidencia._id}>
                            <strong>{incidencia.titulo}</strong>: {incidencia.descripcionDetallada} - Gravedad: {incidencia.gravedadImpacto}
                            <br />
                            Reportado por: {incidencia.reportadoPor.nombre} ({incidencia.reportadoPor.contacto})
                            <br />
                            Ubicación: {incidencia.ubicacionEspecifica}
                            <br />
                            Categoría: {incidencia.categoria}
                            <br />
                            Fecha y hora: {new Date(incidencia.fechaHoraReporte).toLocaleString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay incidencias disponibles.</p> // Mensaje si no hay incidencias
            )}

            <button onClick={handleGoBack} className="btn btn-secondary mt-3">Volver</button>
        </div>
    );
}
