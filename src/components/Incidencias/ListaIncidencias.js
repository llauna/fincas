// components/Incidencias/ListaIncidencias.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIncidenciasController } from '../../controllers/useIncidenciasController';
import { useTableController } from '../../controllers/useTableController';

export default function ListaIncidencias() {
    const navigate = useNavigate();
    const { propietarioId } = useParams();

    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const userEmail = storedUser?.email ? storedUser.email.toLowerCase() : null;
    const userRole = storedUser?.rol || '';

    const { incidencias, loading, error, recargar } = useIncidenciasController(userRole, userEmail, propietarioId, navigate);

    const {
        datosPaginados,
        paginaActual,
        setPaginaActual,
        totalPaginas,
        filtroTexto,
        setFiltroTexto,
        ordenColumna,
        ordenDireccion,
        cambiarOrden,
        itemsPorPagina,
        setItemsPorPagina,
        exportToCSV,
        exportToExcel
    } = useTableController(incidencias, 'incidenciasTableConfig', 5);

    const getStatusBadge = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'pendiente': return 'bg-warning text-dark';
            case 'en progreso': return 'bg-info text-white';
            case 'resuelta': return 'bg-success text-white';
            case 'rechazada': return 'bg-danger text-white';
            default: return 'bg-secondary text-white';
        }
    };

    const getGravedadBadge = (gravedad) => {
        switch (gravedad?.toLowerCase()) {
            case 'alta': return 'bg-danger text-white';
            case 'media': return 'bg-warning text-dark';
            case 'baja': return 'bg-info text-white';
            default: return 'bg-secondary text-white';
        }
    };

    if (loading) return <div className="text-center mt-5">Cargando incidencias...</div>;
    if (error) return (
        <div className="alert alert-danger mt-5">
            <h4>Error</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={recargar}>Reintentar</button>
        </div>
    );

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Listado de Incidencias</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/incidencias/abrir/${propietarioId}`)}
                >
                    <i className="bi bi-plus-circle me-2"></i> Nueva Incidencia
                </button>
            </div>

            {/* 🔹 Filtro y selector en la misma fila */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                    type="text"
                    className="form-control me-3"
                    style={{ maxWidth: '300px' }}
                    placeholder="Buscar..."
                    value={filtroTexto}
                    onChange={(e) => setFiltroTexto(e.target.value)}
                />
                <div className="d-flex align-items-center">
                    <label className="me-2 mb-0">Incidencias por página:</label>
                    <select
                        className="form-select"
                        style={{ width: '100px' }}
                        value={itemsPorPagina}
                        onChange={(e) => {
                            setItemsPorPagina(Number(e.target.value));
                            setPaginaActual(1);
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>

            {datosPaginados.length === 0 ? (
                <p>No hay incidencias registradas</p>
            ) : (
                <>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th onClick={() => cambiarOrden('titulo')} style={{cursor: 'pointer'}}>
                                Título / Descripción {ordenColumna === 'titulo' && (ordenDireccion === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => cambiarOrden('estado')} style={{cursor: 'pointer'}}>
                                Estado {ordenColumna === 'estado' && (ordenDireccion === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => cambiarOrden('gravedadImpacto')} style={{cursor: 'pointer'}}>
                                Gravedad {ordenColumna === 'gravedadImpacto' && (ordenDireccion === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => cambiarOrden('fechaHoraReporte')} style={{cursor: 'pointer'}}>
                                Fecha {ordenColumna === 'fechaHoraReporte' && (ordenDireccion === 'asc' ? '▲' : '▼')}
                            </th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {datosPaginados.map(inc => (
                            <tr key={inc._id}>
                                <td>
                                    <div className="fw-bold">{inc.titulo}</div>
                                    <div className="text-muted small">{inc.descripcionDetallada}</div>
                                </td>
                                <td><span className={`badge ${getStatusBadge(inc.estado)}`}>{inc.estado}</span></td>
                                <td><span className={`badge ${getGravedadBadge(inc.gravedadImpacto)}`}>{inc.gravedadImpacto}</span></td>
                                <td>{new Date(inc.fechaHoraReporte).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => navigate(`/incidencias/editar/${inc._id}`)}
                                    >
                                        <i className="bi bi-pencil"></i> Modificar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* 🔹 Paginación */}
                    <div className="d-flex justify-content-center mt-3">
                        <nav>
                            <ul className="pagination">
                                {Array.from({ length: totalPaginas }, (_, i) => (
                                    <li key={i} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPaginaActual(i + 1)}>
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </>
            )}

            {/* 🔹 Botones al nivel de Volver */}
            <div className="d-flex justify-content-between mt-4">
                <button onClick={() => navigate(-1)} className="btn btn-secondary">Volver</button>
                <div>
                    <button className="btn btn-outline-success me-2" onClick={() => exportToExcel('incidencias.xlsx')}>
                        Exportar a Excel
                    </button>
                    <button className="btn btn-outline-primary" onClick={() => exportToCSV('incidencias.csv')}>
                        Exportar a CSV
                    </button>
                </div>
            </div>
        </div>
    );
}
