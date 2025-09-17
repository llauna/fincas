// components/Login.js
import React, { useState } from 'react';
import AuthService from '../services/AuthService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { token } = await AuthService.login(email, password);
            localStorage.setItem('token', token); // Guarda el token en localStorage
            alert('Inicio de sesión exitoso');
        } catch (err) {
            alert('Error al iniciar sesión');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
};

export default Login;
