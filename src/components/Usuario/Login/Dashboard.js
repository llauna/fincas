// src/components/Usuario/Login/Dashboard.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const user = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        if (!storedToken) {
            navigate('/login');
        }
    }, [storedToken, navigate]);

    if (!user) return null;

    return (
        <div className="container mt-4">
            {user.tipo === 'empleado' && (
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <h1 className="text-center">Bienvenido, Empleado 👨‍💼</h1>


                </div>
            )}

            {user.tipo === 'cliente' && (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <div className="text-center">
                        <h1>Bienvenido, Cliente 🏠</h1>
                        <p>Gracias por usar nuestra plataforma.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

