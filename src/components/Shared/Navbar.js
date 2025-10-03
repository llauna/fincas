// src/components/Layout/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/navbar.css';

const Navbar = () => {
    const [isInicioMenuOpen, setIsInicioMenuOpen] = useState(false);
    const [isGestionMenuOpen, setIsGestionMenuOpen] = useState(false);
    const [isUsuarioMenuOpen, setIsUsuarioMenuOpen] = useState(false);
    const [isFinanzasMenuOpen, setIsFinanzasMenuOpen] = useState(false);
    const navigate = useNavigate();

// 🔹 Recuperar usuario logueado de forma segura
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    // user debe tener { tipo: 'empleado' | 'cliente', rol: '...' }

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user'); // limpiar datos usuario
        navigate('/login');
    };

    const toggleInicioMenu = () => {
        setIsInicioMenuOpen(!isInicioMenuOpen);
        setIsUsuarioMenuOpen(false);
        setIsGestionMenuOpen(false);
        setIsFinanzasMenuOpen(false);
    };
    const toggleGestionMenu = () => {
        setIsGestionMenuOpen(!isGestionMenuOpen);
        setIsInicioMenuOpen(false);
        setIsUsuarioMenuOpen(false);
        setIsFinanzasMenuOpen(false);
    };
    const toggleUsuarioMenu = () => {
        setIsUsuarioMenuOpen(!isUsuarioMenuOpen);
        setIsInicioMenuOpen(false);
        setIsGestionMenuOpen(false);
        setIsFinanzasMenuOpen(false);
    };
    const toggleFinanzasMenu = () => {
        setIsFinanzasMenuOpen(!isFinanzasMenuOpen);
        setIsInicioMenuOpen(false);
        setIsGestionMenuOpen(false);
        setIsUsuarioMenuOpen(false);
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'flex-start', gap: '20px', backgroundColor: '#333', padding: '10px', position: 'absolute', left: 0, top: 0, width: '100%', zIndex: 1000 }}>

                {/* Menú Inicio */}
                <div style={{ position: 'relative' }}>
                    <Link to="#" onClick={toggleInicioMenu} style={{ color: 'white', textDecoration: 'none' }}>
                        Inicio
                    </Link>
                    {isInicioMenuOpen && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: '#444', border: '1px solid #555', zIndex: 10, minWidth: '150px' }}>
                            <Link to="/empresa" onClick={() => setIsInicioMenuOpen(false)} style={{ display: 'block', padding: '10px', color: 'white', textDecoration: 'none', borderBottom: '1px solid #555' }}>Empresa</Link>
                            {/* 🔹 Solo mostrar si es empleado */}
                            {user?.tipo === 'empleado' && (
                                <Link to="/empleados" onClick={() => setIsInicioMenuOpen(false)} style={{ display: 'block', padding: '10px', color: 'white', textDecoration: 'none', borderBottom: '1px solid #555' }}>Empleados</Link>
                            )}
                            <Link to="/proveedores" onClick={() => setIsInicioMenuOpen(false)} style={{ display: 'block', padding: '10px', color: 'white', textDecoration: 'none' }}>Proveedores</Link>
                            <Link to="/roles" onClick={() => setIsInicioMenuOpen(false)} style={{ display: 'block', padding: '10px', color: 'white', textDecoration: 'none' }}>Roles</Link>
                        </div>
                    )}
                </div>
            {/* Menú Gestión */}
            <div style={{ position: 'relative' }}>
                <Link to="#" onClick={toggleGestionMenu} style={{ color: 'white', textDecoration: 'none' }}>
                    Gestión
                </Link>
                {isGestionMenuOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: '#444', border: '1px solid #555', zIndex: 10, minWidth: '150px' }}>
                        <Link to="/propiedades" onClick={() => setIsGestionMenuOpen(false)} style={{ display: 'block', padding: '10px', color: 'white', textDecoration: 'none', borderBottom: '1px solid #555' }}>Propiedades</Link>
                        <Link to="/comunidades" onClick={() => setIsGestionMenuOpen(false)} style={{ display: 'block', padding: '10px', color: 'white', textDecoration: 'none', borderBottom: '1px solid #555' }}>Comunidades</Link>
                        <Link to="/propietarios" onClick={() => setIsGestionMenuOpen(false)} style={{ display: 'block', padding: '10px', color: 'white', textDecoration: 'none' }}>Propietarios</Link>
                    </div>
                )}
            </div>

            {/* Menú Usuarios */}
            <div style={{ position: 'relative' }}>
                <Link to="#" onClick={toggleUsuarioMenu} style={{ color: 'white', textDecoration: 'none' }}>
                    Usuarios
                </Link>
                {isUsuarioMenuOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: '#444', border: '1px solid #555', zIndex: 10, minWidth: '150px' }}>
                        <Link to="/perfil" onClick={() => setIsUsuarioMenuOpen(false)} style={{ display: 'block', padding: '10px', color: 'white', textDecoration: 'none', borderBottom: '1px solid #555' }}>Perfil</Link>
                        <Link to="/configuracion" onClick={() => setIsUsuarioMenuOpen(false)} style={{ display: 'block', padding: '10px', color: 'white', textDecoration: 'none' }}>Configuración</Link>
                    </div>
                )}
            </div>

            {/* Menú Finanzas */}
            <div style={{ position: 'relative' }}>
                <Link to="#" onClick={toggleFinanzasMenu} style={{ color: 'white', textDecoration: 'none' }}>
                    Finanzas
                </Link>
                {isFinanzasMenuOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: '#444', border: '1px solid #555', zIndex: 10, minWidth: '150px' }}>
                        <Link to="/banco" onClick={() => setIsFinanzasMenuOpen(false)} style={{ display: 'block', padding: '10px', color: 'white', textDecoration: 'none', borderBottom: '1px solid #555' }}>Banco</Link>
                        <Link to="/caja" onClick={() => setIsFinanzasMenuOpen(false)} style={{ display: 'block', padding: '10px', color: 'white', textDecoration: 'none' }}>Caja</Link>
                    </div>
                )}
            </div>

            <Link to="/login" onClick={handleLogout} style={{ color: 'white', textDecoration: 'none' }}>Cerrar Sesión</Link>
        </nav>
    );
};

export default Navbar;
