// components/Incidencias/CrearIncidencia.js
import React, { useState } from 'react';

export default function CrearIncidencia() {
    const [formData, setFormData] = useState({
        idIncidencia: '',
        titulo: '',
        descripcionDetallada: '',
        gravedadImpacto: '',
        categoria: '',
        ubicacionEspecifica: '',
        reportadoPor: { nombre: '', contacto: '' }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'nombre' || name === 'contacto') {
            setFormData((prev) => ({
                ...prev,
                reportadoPor: { ...prev.reportadoPor, [name]: value }
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3001/api/incidencias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert('Incidencia creada exitosamente');
                setFormData({
                    idIncidencia: '',
                    titulo: '',
                    descripcionDetallada: '',
                    gravedadImpacto: '',
                    categoria: '',
                    ubicacionEspecifica: '',
                    reportadoPor: { nombre: '', contacto: '' }
                });
            } else {
                alert('Error al crear la incidencia');
            }
        } catch (error) {
            console.error('Error al crear incidencia:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Crear Incidencia</h2>
            <div>
                <label>ID Incidencia:</label>
                <input
                    type="text"
                    name="idIncidencia"
                    value={formData.idIncidencia}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Título:</label>
                <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Descripción Detallada:</label>
                <textarea
                    name="descripcionDetallada"
                    value={formData.descripcionDetallada}
                    onChange={handleChange}
                    required
                ></textarea>
            </div>
            <div>
                <label>Gravedad Impacto:</label>
                <select
                    name="gravedadImpacto"
                    value={formData.gravedadImpacto}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecciona una opción</option>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                </select>
            </div>
            <div>
                <label>Categoría:</label>
                <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Ubicación Específica:</label>
                <input
                    type="text"
                    name="ubicacionEspecifica"
                    value={formData.ubicacionEspecifica}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Reportado por (Nombre):</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.reportadoPor.nombre}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Contacto:</label>
                <input
                    type="text"
                    name="contacto"
                    value={formData.reportadoPor.contacto}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Crear Incidencia</button>
        </form>
    );
}
