import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Componente para proteger rutas que requieren autenticación.
 * Si no hay token, redirige a /login.
 */
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token, renderiza el contenido protegido
    return children;
};

export default PrivateRoute;
