// src/components/Usuario/Login/Dashboard.js
import React from 'react';
import Navbar from '../../Shared/Navbar'; // Asegúrate de que la ruta sea correcta

const Dashboard = () => {
    return (
        <div>
            <Navbar /> {/* Renderiza el menú aquí */}
            <h1>Bienvenido al Dashboard</h1>
            <p>Contenido principal de la aplicación...</p>
        </div>
    );
};

export default Dashboard;