import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdministradorFincas = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="container mt-4"> {/* Un contenedor para centrar y añadir margen */}
            <h1>Vista de AdministradorFincas</h1>
            <button
                onClick={handleGoBack}
                className="btn btn-secondary mt-3" // Clases de Bootstrap
            >
                Volver
            </button>
        </div>
    );
};

export default AdministradorFincas;