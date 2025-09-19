// components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import AuthService from '../../../services/AuthService';
import './Login.css';
import axios from "axios";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/usuarios/login', { email, password });
            console.log('Respuesta del servidor: ', response); // Llama al servicio de autenticación
            alert('Inicio de sesión exitoso');
            navigate('/dashboard'); // Redirige al dashboard
        } catch (error) {
            alert('Error al iniciar sesión');
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
                        />
                    </div>
                    <div className="form-group d-flex align-items-center mb-3">
                        <label htmlFor="password" className="me-3" style={{ width: '150px', textAlign: 'right' }} >Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
