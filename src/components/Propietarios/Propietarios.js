// src/components/Propiedades.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Propiedades = () => {
    const navigate = useNavigate();
    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estado del formulario de propiedades
    const [formData, setFormData] = useState({
        idPropietario: '',
        direccion: '',
        numero: '',
        poblacion: '',
        cp: '',
        planta: '',
        coeficiente: ''
    });

    // Estado para la lista de propietarios disponibles
    const [propietariosDisponibles, setPropietariosDisponibles] = useState([]);

    const API_PROPIEDADES_URL = 'http://localhost:3001/api/propiedades';
    const API_PROPIETARIOS_URL = 'http://localhost:3001/api/propietarios';

    // Función para obtener todas las propiedades y propietarios
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener propiedades
                const propiedadesResponse = await axios.get(API_PROPIEDADES_URL);
                setPropiedades(propiedadesResponse.data);

                // Obtener propietarios disponibles
                const propietariosResponse = await axios.get(API_PROPIETARIOS_URL);
                setPropietariosDisponibles(propietariosResponse.data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCrear = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_PROPIEDADES_URL, formData);
            setFormData({
                idPropietario: '',
                direccion: '',
                numero: '',
                poblacion: '',
                cp: '',
                planta: '',
                coeficiente: ''
            }); // Limpiar formulario
            // Recargar datos
            const propiedadesResponse = await axios.get(API_PROPIEDADES_URL);
            setPropiedades(propiedadesResponse.data);
        } catch (error) {
            console.error('Error al guardar la propiedad:', error);
        }
    };

    const handleEliminar = async (id) => {
        try {
            await axios.delete(`${API_PROPIEDADES_URL}/${id}`);
            // Recargar datos
            const propiedadesResponse = await axios.get(API_PROPIEDADES_URL);
            setPropiedades(propiedadesResponse.data);
        } catch (error) {
            console.error('Error al eliminar la propiedad:', error);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
    }

    return (
        <div className="container mt-4">
            <h1>Vista de Propiedades</h1>

            {/* Formulario de creación de propiedades */}
            <form className="row g-3" onSubmit={handleCrear}>
                <div className="col-md-2">
                    <label htmlFor="idPropietario" className="form-label">Propietario</label>
                    <select
                        className="form-select"
                        id="idPropietario"
                        name="idPropietario"
                        value={formData.idPropietario}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione...</option>
                        {propietariosDisponibles.map((prop) => (
                            <option key={prop._id} value={prop._id}>
                                {prop.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-2">
                    <label htmlFor="direccion" className="form-label">Dirección</label>
                    <input type="text" className="form-control" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required />
                </div>
                <div className="col-md-2">
                    <label htmlFor="numero" className="form-label">Número</label>
                    <input type="text" className="form-control" id="numero" name="numero" value={formData.numero} onChange={handleChange} required />
                </div>
                <div className="col-md-2">
                    <label htmlFor="poblacion" className="form-label">Población</label>
                    <input type="text" className="form-control" id="poblacion" name="poblacion" value={formData.poblacion} onChange={handleChange} required />
                </div>
                <div className="col-md-2">
                    <label htmlFor="cp" className="form-label">CP</label>
                    <input type="text" className="form-control" id="cp" name="cp" value={formData.cp} onChange={handleChange} required />
                </div>
                <div className="col-md-2">
                    <label htmlFor="planta" className="form-label">Planta</label>
                    <input type="text" className="form-control" id="planta" name="planta" value={formData.planta} onChange={handleChange} required />
                </div>
                <div className="col-md-2">
                    <label htmlFor="coeficiente" className="form-label">Coeficiente</label>
                    <input type="number" className="form-control" id="coeficiente" name="coeficiente" value={formData.coeficiente} onChange={handleChange} required step="0.01" />
                </div>
                <div className="col-12 mt-3">
                    <button type="submit" className="btn btn-primary">Crear</button>
                </div>
            </form>

            <h2 className="mt-5">Listado de Propiedades</h2>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>ID Propietario</th>
                    <th>Dirección</th>
                    <th>Número</th>
                    <th>Población</th>
                    <th>CP</th>
                    <th>Planta</th>
                    <th>Coeficiente</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {propiedades.map(prop => {
                    const propietario = propietariosDisponibles.find(p => p._id === prop.idPropietario);
                    const nombrePropietario = propietario ? propietario.nombre : 'Desconocido';

                    return (
                        <tr key={prop._id}>
                            <td>{nombrePropietario}</td>
                            <td>{prop.direccion}</td>
                            <td>{prop.numero}</td>
                            <td>{prop.poblacion}</td>
                            <td>{prop.cp}</td>
                            <td>{prop.planta}</td>
                            <td>{prop.coeficiente}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(prop._id)}>Eliminar</button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            <button
                onClick={handleGoBack}
                className="btn btn-secondary mt-3"
            >
                Volver
            </button>
        </div>
    );
};

export default Propiedades;
