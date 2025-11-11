// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            alert('Por favor, ingresa tu correo y contraseña');
            return;
        }
        
        try {
            // Mostrar la contraseña en texto plano (solo para depuración)
            console.log('Enviando contraseña en texto plano');
            
            console.log('Iniciando sesión con:', { email });
            
            console.log('Enviando solicitud de login...');
            const response = await fetch('http://localhost:3001/api/usuarios/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    password: password, // Enviamos la contraseña en texto plano
                    isPreHashed: false // Indicamos que la contraseña NO está hasheada
                }),
                credentials: 'include'
            });
            
            console.log('Respuesta recibida:', {
                status: response.status,
                statusText: response.statusText
            });
            
            const responseData = await response.json().catch(error => {
                console.error('Error al parsear la respuesta JSON:', error);
                return { message: 'Error al procesar la respuesta del servidor' };
            });
            
            console.log('Datos de la respuesta:', responseData);
            
            if (!response.ok) {
                console.error('Error en la respuesta del servidor:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData: responseData
                });
                
                let errorMessage = 'Error en la autenticación';
                if (responseData.details) {
                    errorMessage += `: ${responseData.details}`;
                } else if (responseData.message) {
                    errorMessage = responseData.message;
                }
                
                throw new Error(errorMessage);
            }
            
            // La respuesta ya fue parseada como responseData
            const data = responseData;
            
            // Guardar token y usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            console.log("✅ Usuario autenticado:", data.user);
            
            // Mostrar mensaje de éxito
            alert('✅ Login exitoso');
            
            // Redirigir al dashboard
            navigate('/dashboard');
            
            return data;
        } catch (error) {
            console.error('Error en login:', error);
            alert('❌ Error en el servidor');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h3 className="text-center mb-4">Iniciar Sesión</h3>
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
                                    />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">
                                        Iniciar sesión
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
