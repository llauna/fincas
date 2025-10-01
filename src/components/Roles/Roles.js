// RolForm.jsx (En tu proyecto React)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Los valores de enum deben estar disponibles en el frontend
const ROL_OPTIONS = ['Administrador', 'Propietario', 'Usuario_1', 'Usuario_2'];

function RolForm() {

    const navigate = useNavigate();
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

    const handleGoBack = () => {
        navigate(-1);
    };


    return (
        <div>
                <form onSubmit={handleSubmit}>
                    <h3>Asignar Nuevo Rol</h3>
                    <select
                        value={selectedRol}
                        onChange={(e) => setSelectedRol(e.target.value)}
                        required
                    >
                        {ROL_OPTIONS.map(rol => (
                            <option key={rol} value={rol}>{rol}</option>
                        ))}
                    </select>
                    <button type="submit">Crear Rol</button>
                    {message && <p>{message}</p>}
                </form>
            {/* Botón volver */}
            <div className="text-center mt-4">
                <button onClick={handleGoBack} className="btn btn-secondary">Volver</button>
            </div>
        </div>

    );
}

export default RolForm;