// RolForm.jsx (En tu proyecto React)
import React, { useState } from 'react';
import axios from 'axios';

// Los valores de enum deben estar disponibles en el frontend
const ROL_OPTIONS = ['Administrador', 'Propietario', 'Usuario_1', 'Usuario_2'];

function RolForm() {

    const [selectedRol, setSelectedRol] = useState(ROL_OPTIONS[0]);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            // Asumiendo que tienes una ruta POST /api/roles en tu Express
            await axios.post('/api/roles', { nombre: selectedRol });
            setMessage(`Rol "${selectedRol}" creado exitosamente.`);
            // Nota: Aquí deberías actualizar la lista de roles en RolList
        } catch (error) {
            setMessage('Error al crear el rol: ' + (error.response?.data?.message || 'Error desconocido.'));
        }
    };


    return (
        <div>
                <form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
                    <h3 className="mb-3">Asignar Nuevo Rol</h3>
                    <select
                        className="form-select mb-3"
                        value={selectedRol}
                        onChange={(e) => setSelectedRol(e.target.value)}
                        required
                    >
                        {ROL_OPTIONS.map(rol => (
                            <option key={rol} value={rol}>{rol}</option>
                        ))}
                    </select>
                    <button type="submit" className="btn btn-primary w-100 mb-3">Crear Rol</button>
                    {message && <p>{message}</p>}
                </form>
        </div>

    );
}

export default RolForm;