// src/components/Usuario/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // Aquí pon la lógica de tu autenticación.
    // Por ahora, verificamos si existe el token en el localStorage.
    const isAuthenticated = () => {
        const token = localStorage.getItem('authToken');
        return !!token; // Esto devuelve true si el token existe, false si no
    };

    return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;