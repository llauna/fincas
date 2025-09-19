// src/components/Layout/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Elimina el token de autenticación del almacenamiento local
        localStorage.removeItem('authToken');
        // Redirige al usuario a la página de login
        navigate('/login');
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: '#333', padding: '10px' }}>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Inicio</Link>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Perfil</Link>
            <Link to="/settings" style={{ color: 'white', textDecoration: 'none' }}>Configuración</Link>

            {/* Usa un componente Link para mantener el mismo estilo */}
            <Link
                to="/login" // Aunque redirige, el `onClick` se ejecutará primero
                onClick={handleLogout}
                style={{ color: 'white', textDecoration: 'none' }}
            >
                Cerrar Sesión
            </Link>
        </nav>
    );
};

export default Navbar;