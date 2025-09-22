import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getPropiedades,
    createPropiedad,
    updatePropiedad,
    deletePropiedad,
} from '../../services/PropiedadesService';

    const initialForm = {
        idPropietario: '',
        direccion: '',
        numero: '',
        poblacion: '',
        cp: '',
        planta: '',
        coeficiente: '',
    };

    const Propiedades = () => {
        const navigate = useNavigate();
        const [propiedades, setPropiedades] = useState([]);
        const [form, setForm] = useState(initialForm);
        const [editingId, setEditingId] = useState(null);

        useEffect(() => {
            fetchPropiedades();
        }, []);

    const fetchPropiedades = async () => {
        const data = await getPropiedades();
        console.log('Propiedades recibidas', data);
        setPropiedades(data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await updatePropiedad(editingId, form);
        } else {
            await createPropiedad(form);
        }
        setForm(initialForm);
        setEditingId(null);
        fetchPropiedades();
    };

    const handleEdit = (propiedad) => {
        setForm(propiedad);
        setEditingId(propiedad._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que quieres eliminar esta propiedad?')) {
            await deletePropiedad(id);
            fetchPropiedades();
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Vista de Propiedades</h1>
            <form className="row g-3 mb-4" onSubmit={handleSubmit}>
                <div className="col-md-3">
                    <input className="form-control" name="idPropietario" placeholder="ID Propietario" value={form.idPropietario} onChange={handleChange} required />
                </div>
                <div className="col-md-3">
                    <input className="form-control" name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} required />
                </div>
                <div className="col-md-2">
                    <input className="form-control" name="numero" placeholder="Número" value={form.numero} onChange={handleChange} required />
                </div>
                <div className="col-md-2">
                    <input className="form-control" name="poblacion" placeholder="Población" value={form.poblacion} onChange={handleChange} required />
                </div>
                <div className="col-md-2">
                    <input className="form-control" name="cp" placeholder="CP" value={form.cp} onChange={handleChange} required />
                </div>
                <div className="col-md-2">
                    <input className="form-control" name="planta" placeholder="Planta" value={form.planta} onChange={handleChange} required />
                </div>
                <div className="col-md-2">
                    <input className="form-control" name="coeficiente" placeholder="Coeficiente" type="number" value={form.coeficiente} onChange={handleChange} required />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                    <button className="btn btn-primary me-2" type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
                    {editingId && (
                        <button className="btn btn-secondary" type="button" onClick={() => { setForm(initialForm); setEditingId(null); }}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
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
                {propiedades.map((prop) => (
                    <tr key={prop._id}>
                        <td>{prop.idPropietario}</td>
                        <td>{prop.direccion}</td>
                        <td>{prop.numero}</td>
                        <td>{prop.poblacion}</td>
                        <td>{prop.cp}</td>
                        <td>{prop.planta}</td>
                        <td>{prop.coeficiente}</td>
                        <td>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(prop)}>Editar</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(prop._id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
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
