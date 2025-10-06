// src/components/Usuario/Login/Dashboard.js
import React from 'react';


const Dashboard = () => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    return (
        <div>
            {user?.tipo === 'empleado' && (
                <h1>Bienvenido, Empleado 👨‍💼</h1>
            )}
            {user?.tipo === 'cliente' && (
                <h1>Bienvenido, Cliente 🏠</h1>
            )}
            <p>Este es tu panel de control.</p>
        </div>
    );
};

export default Dashboard;