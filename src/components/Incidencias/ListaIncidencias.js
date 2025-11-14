import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ListaIncidencias() {
    const navigate = useNavigate();
    const { propietarioId } = useParams(); // Obtener el propietarioId desde la URL
    const [incidencias, setIncidencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Email del usuario logeado
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const userEmail = storedUser?.email ? storedUser.email.toLowerCase() : null;

    useEffect(() => {
        const fetchIncidencias = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));
                
                if (!token || !user) {
                    throw new Error('No se encontró la información de autenticación. Por favor, inicie sesión nuevamente.');
                }
                
                console.log('Token de autenticación:', token);
                console.log('Usuario actual:', user);
                
                const res = await fetch('http://localhost:3001/api/incidencias', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include' // Importante para las cookies de autenticación
                });
                
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('Error en la respuesta del servidor:', errorText);
                    let errorMessage = 'Error al obtener las incidencias';
                    
                    try {
                        const errorData = JSON.parse(errorText);
                        errorMessage = errorData.message || errorMessage;
                    } catch (e) {
                        errorMessage = errorText || errorMessage;
                    }
                    
                    throw new Error(errorMessage);
                }
                
                const data = await res.json();
                console.log('Datos recibidos del servidor (crudos):', data);
                
                // Verificar si hay datos
                if (!Array.isArray(data)) {
                    console.error('La respuesta del servidor no es un array:', data);
                    throw new Error('Formato de datos inválido recibido del servidor');
                }
                
                console.log('Número de incidencias recibidas:', data.length);
                
                // Mostrar información de depuración para cada incidencia
                data.forEach((incidencia, index) => {
                    console.log(`Incidencia ${index + 1}:`, {
                        id: incidencia._id,
                        reportadoPor: incidencia.reportadoPor,
                        usuarioActual: user._id,
                        esDelUsuario: incidencia.reportadoPor?._id === user._id || 
                                    incidencia.reportadoPor?._id?.toString() === user._id
                    });
                });
                
                // Para depuración, mostramos todas las incidencias sin filtrar
                console.log('Mostrando todas las incidencias sin filtrar');
                console.log('Número total de incidencias:', data.length);
                
                // Mostrar información detallada de cada incidencia
                data.forEach((incidencia, index) => {
                    console.log(`Incidencia ${index + 1}:`, {
                        id: incidencia._id,
                        titulo: incidencia.titulo || 'Sin título',
                        descripcion: incidencia.descripcionDetallada || 'Sin descripción',
                        reportadoPor: incidencia.reportadoPor ? {
                            id: incidencia.reportadoPor._id,
                            nombre: incidencia.reportadoPor.nombre || 'Sin nombre'
                        } : 'No especificado'
                    });
                });
                
                // Si no hay incidencias, mostramos un mensaje
                if (data.length === 0) {
                    console.log('No se encontraron incidencias en la base de datos');
                }
                
                // Por ahora, mostramos todas las incidencias sin filtrar
                setIncidencias(data);
                setError(null);
            } catch (error) {
                console.error('Error al obtener las incidencias:', error);
                setError(error.message);
                
                // Si el error es de autenticación, redirigir al login
                if (error.message.includes('No token') || error.message.includes('Token is not valid')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchIncidencias();
    }, [propietarioId, navigate]);
    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando incidencias...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    <h4>Error al cargar las incidencias</h4>
                    <p>{error}</p>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    const handleGoBack = () => {
        navigate(-1);
    };

    // Función para obtener el color según el estado de la incidencia
    const getStatusBadge = (estado) => {
        switch(estado?.toLowerCase()) {
            case 'pendiente':
                return 'bg-warning text-dark';
            case 'en progreso':
                return 'bg-info text-white';
            case 'resuelta':
                return 'bg-success text-white';
            case 'rechazada':
                return 'bg-danger text-white';
            default:
                return 'bg-secondary text-white';
        }
    };

    // Función para obtener las incidencias
    const fetchIncidencias = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            
            if (!token || !user) {
                throw new Error('No se encontró la información de autenticación. Por favor, inicie sesión nuevamente.');
            }
            
            const res = await fetch('http://localhost:3001/api/incidencias', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error('Error en la respuesta del servidor:', errorText);
                let errorMessage = 'Error al obtener las incidencias';
                
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                
                throw new Error(errorMessage);
            }
            
            const data = await res.json();
            console.log('Datos recibidos del servidor (crudos):', data);
            
            // Verificar si hay datos
            if (!Array.isArray(data)) {
                console.error('La respuesta del servidor no es un array:', data);
                throw new Error('Formato de datos inválido recibido del servidor');
            }
            
            console.log('Número de incidencias recibidas:', data.length);
            
            // Mostrar información de depuración para cada incidencia
            data.forEach((incidencia, index) => {
                console.log(`Incidencia ${index + 1}:`, {
                    id: incidencia._id,
                    titulo: incidencia.titulo || 'Sin título',
                    descripcion: incidencia.descripcionDetallada || 'Sin descripción',
                    reportadoPor: incidencia.reportadoPor ? {
                        id: incidencia.reportadoPor._id,
                        nombre: incidencia.reportadoPor.nombre || 'Sin nombre'
                    } : 'No especificado'
                });
            });
            
            // Si no hay incidencias, mostramos un mensaje
            if (data.length === 0) {
                console.log('No se encontraron incidencias en la base de datos');
            }
            
            setIncidencias(data);
            setError(null);
        } catch (error) {
            console.error('Error al obtener las incidencias:', error);
            setError(error.message);
            
            // Si el error es de autenticación, redirigir al login
            if (error.message.includes('No token') || error.message.includes('Token is not valid')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h3 className="mb-0"><i className="bi bi-clipboard2-pulse me-2"></i>Listado de Incidencias</h3>
                    <button
                        className="btn btn-light"
                        onClick={() => navigate(`/incidencias/abrir/${propietarioId}`)}
                    >
                        <i className="bi bi-plus-circle me-2"></i>Nueva Incidencia
                    </button>
                </div>
                
                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger d-flex justify-content-between align-items-center">
                            <div>
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {error}
                            </div>
                            <button className="btn btn-sm btn-outline-light" onClick={fetchIncidencias}>
                                <i className="bi bi-arrow-clockwise me-1"></i>Reintentar
                            </button>
                        </div>
                    )}
                    
                    {incidencias.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="mb-3">
                                <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                            </div>
                            <h5 className="text-muted">No hay incidencias registradas</h5>
                            <p className="text-muted">Crea tu primera incidencia para comenzar</p>
                            <button 
                                className="btn btn-primary mt-2"
                                onClick={() => navigate(`/incidencias/abrir/${propietarioId}`)}
                            >
                                <i className="bi bi-plus-circle me-2"></i>Crear Incidencia
                            </button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        {/* Quitamos la columna ID */}
                                        <th style={{ width: '30%' }}>Título</th>
                                        <th style={{ width: '35%' }}>Descripción</th>
                                        <th>Estado</th>
                                        <th>Gravedad</th>
                                        <th>Reportado por</th>
                                        <th>Fecha</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                {incidencias.map((incidencia) => (
                                    <tr key={incidencia._id} style={{ cursor: 'pointer' }}>
                                        {/* Columna Título ampliada y sin "Sin título" */}
                                        <td style={{ minWidth: '220px' }}>
                                            <div className="fw-semibold">
                                                {incidencia.titulo && incidencia.titulo.trim()
                                                    ? incidencia.titulo
                                                    : ''}
                                            </div>
                                            <div className="text-muted small">
                                                {incidencia.ubicacionEspecifica || 'Sin ubicación'}
                                            </div>
                                        </td>

                                        {/* Columna Descripción más ancha */}
                                        <td>
                                            <div
                                                className="text-truncate"
                                                style={{ maxWidth: '420px' }}
                                                title={incidencia.descripcionDetallada}
                                            >
                                                {incidencia.descripcionDetallada || 'Sin descripción'}
                                            </div>
                                        </td>

                                        {/* Estado */}
                                        <td>
                <span className={`badge ${getStatusBadge(incidencia.estado)}`}>
                    {incidencia.estado || 'Pendiente'}
                </span>
                                        </td>

                                        {/* Gravedad */}
                                        <td>
                <span
                    className={`badge ${
                        incidencia.gravedadImpacto?.toLowerCase() === 'alta'
                            ? 'bg-danger'
                            : incidencia.gravedadImpacto?.toLowerCase() === 'media'
                                ? 'bg-warning text-dark'
                                : 'bg-info'
                    }`}
                >
                    {incidencia.gravedadImpacto || 'baja'}
                </span>
                                        </td>

                                        {/* Reportado por: solo si el correo coincide con el del usuario logeado */}
                                        <td>
                                            {(() => {
                                                const contacto = incidencia.reportadoPor?.contacto || '';
                                                const correoIncidencia = contacto.toLowerCase();

                                                // Si no hay email de usuario o no coincide, no mostramos nada
                                                if (!userEmail || correoIncidencia !== userEmail) {
                                                    return null; // o return '-' si quieres mostrar un guion
                                                }

                                                return (
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar-sm me-2">
                                                            <div className="avatar-title bg-light rounded-circle text-primary">
                                                                <i className="bi bi-person-fill"></i>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="fw-medium">
                                                                {incidencia.reportadoPor?.nombre || ''}
                                                            </div>
                                                            <div className="text-muted small">
                                                                {incidencia.reportadoPor?.contacto || ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </td>

                                        {/* Fecha */}
                                        <td>
                                            <div className="small text-muted">
                                                {new Date(incidencia.fechaHoraReporte).toLocaleDateString()}
                                            </div>
                                            <div className="small text-muted">
                                                {new Date(incidencia.fechaHoraReporte).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </td>

                                        {/* Acciones */}
                                        <td>
                                            <div className="btn-group btn-group-sm">
                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/incidencias/${incidencia._id}`);
                                                    }}
                                                    title="Ver detalles"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </button>
                                                {/* Botón Modificar para editar la incidencia */}
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/incidencias/${incidencia._id}/editar`);
                                                    }}
                                                    title="Modificar incidencia"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>

                            </table>
                        </div>
                    )}
                </div>
                
                {incidencias.length > 0 && (
                    <div className="card-footer bg-light d-flex justify-content-between align-items-center">
                        <div className="text-muted small">
                            Mostrando <strong>{incidencias.length}</strong> incidencia{incidencias.length !== 1 ? 's' : ''}
                        </div>
                        <div className="btn-group">
                            <button className="btn btn-sm btn-outline-secondary" disabled>
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-primary active">1</button>
                            <button className="btn btn-sm btn-outline-secondary">2</button>
                            <button className="btn btn-sm btn-outline-secondary">3</button>
                            <button className="btn btn-sm btn-outline-secondary">
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Estilos adicionales */}
            <style jsx>{`
                .table-hover tbody tr:hover {
                    background-color: rgba(13, 110, 253, 0.05);
                }
                .avatar-sm {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .avatar-title {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
            <button onClick={handleGoBack} className="btn btn-secondary mt-3">Volver</button>
        </div>
    );
}
