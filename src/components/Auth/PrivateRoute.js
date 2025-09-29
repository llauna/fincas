import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Componente para proteger rutas que requieren autenticación.
 * Si no hay token, redirige a /login.
 */
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Ajusta si usas otro método de almacenamiento

    if (!token) {
        // Si no hay token, redirige a login
        return <Navigate to="/login" replace />;
    }

    // Si hay token, renderiza el contenido protegido
    return children;
};

export default PrivateRoute;
