// src/components/Incidencias/EditarIncidencia.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditarIncidenciaController } from '../../controllers/editarIncidenciaController';

export default function EditarIncidencia() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { formData, handleChange, handleSubmit, loading, error, success } = useEditarIncidenciaController(id, navigate);

    return (
        <div className="container mt-4">
            <h3>Modificar Incidencia</h3>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Título</label>
                    <input
                        type="text"
                        name="titulo"
                        className="form-control"
                        value={formData.titulo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Descripción</label>
                    <textarea
                        name="descripcionDetallada"
                        className="form-control"
                        value={formData.descripcionDetallada}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Estado</label>
                    <select
                        name="estado"
                        className="form-select"
                        value={formData.estado}
                        onChange={handleChange}
                    >
                        <option value="pendiente">Pendiente</option>
                        <option value="en progreso">En Progreso</option>
                        <option value="resuelta">Resuelta</option>
                        <option value="rechazada">Rechazada</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label>Gravedad</label>
                    <select
                        name="gravedadImpacto"
                        className="form-select"
                        value={formData.gravedadImpacto}
                        onChange={handleChange}
                    >
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}
