// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Spinner personalizado
const LoadingSpinner = () => (
    <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
    </div>
);

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Redirigir si ya está autenticado
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        if (!email || !password) {
            alert('Por favor, ingresa tu correo y contraseña');
            setIsLoading(false);
            return;
        }
        
        try {
            const response = await fetch('http://localhost:3001/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: 'Error del servidor'
                }));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const responseData = await response.json();

            if (!responseData.token || !responseData.usuario) {
                throw new Error('Formato de respuesta del servidor incorrecto');
            }
            localStorage.setItem('token', responseData.token);
            localStorage.setItem('user', JSON.stringify(responseData.usuario));

            navigate('/dashboard');

        } catch (error) {
            setError(error.message || 'Error al conectar con el servidor. Inténtalo de nuevo más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h3 className="text-center mb-4">Iniciar Sesión</h3>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleLogin}>
                                <div className="mb-3 d-flex align-items-center">
                                    <label htmlFor="email" className="form-label me-2">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control flex-grow-1"
                                        placeholder="Introduce tu email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{ marginLeft: '39px' }}
                                    />
                                </div>
                                <div className="mb-3 d-flex align-items-center">
                                    <label htmlFor="password" className="form-label me-2">Contraseña</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control flex-grow-1"
                                        placeholder="Introduce tu contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        style={{ marginLeft: '10px' }}
                                    />
                                </div>
                                <div className="d-grid">
                                    <button
                                        type="submit"
                                        className="btn btn-primary d-flex align-items-center justify-content-center"
                                        disabled={isLoading}
                                        style={{ minWidth: '150px' }}
                                    >
                                        {isLoading ? (
                                            <>
                                                <LoadingSpinner />
                                                <span className="ms-2">Iniciando sesión...</span>
                                            </>
                                        ) : 'Iniciar sesión'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
