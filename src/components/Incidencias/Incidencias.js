import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IncidenciasList() {
    const navigate = useNavigate();
    const [incidencias, setIncidencias] = useState([]); // Inicializa como un array vacío

    useEffect(() => {
        fetch('http://localhost:3001/api/incidencias') // Ruta del backend
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setIncidencias(data); // Solo actualiza si la respuesta es un array
                } else {
                    console.error('La respuesta no es un array:', data);
                    setIncidencias([]); // Si no es un array, inicializa como vacío
                }
            })
            .catch((error) => console.error('Error al obtener incidencias:', error));
    }, []);

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
