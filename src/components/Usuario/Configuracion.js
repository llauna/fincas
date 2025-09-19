import React from 'react';
import { useNavigate } from 'react-router-dom';

const Configuracion = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="container mt-4"> {/* Un contenedor para centrar y añadir margen */}
            <h1>Vista de Configuracion</h1>
            <button
                onClick={handleGoBack}
                className="btn btn-secondary mt-3" // Clases de Bootstrap
            >
                Volver
            </button>
        </div>
    );
};

export default Configuracion;