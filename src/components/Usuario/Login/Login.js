// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // 🔹 Petición al backend para login
            const response = await axios.post('http://localhost:3001/usuarios/login', { email, password });

            // 🔹 Guardar token y datos de usuario en localStorage
            const token = response.data.token;
            const userData = response.data.user; // el backend debe enviarlo

            if (!userData) {
                alert('Error: el backend no está enviando los datos del usuario');
                return;
            }

            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(userData));

            alert('Inicio de sesión exitoso');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert(error.response?.data?.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="card p-4" style={{ width: '400px' }}>
                <h2 className="text-center mb-4">Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group d-flex align-items-center mb-3 ">
                        <label htmlFor="email" className="me-3" style={{ width: '150px', textAlign: 'right' }}>Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Ingresa tu correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group d-flex align-items-center mb-3">
                        <label htmlFor="password" className="me-3" style={{ width: '150px', textAlign: 'right' }}>Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
