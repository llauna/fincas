import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                {user?.tipo === 'empleado' && (
                    <>
                        <div className="menu">
                            <span>Inicio</span>
                            <div className="submenu">
                                <Link to="/empresa">Empresa</Link>
                                <Link to="/proveedores">Proveedores</Link>
                            </div>
                        </div>

                        <div className="menu">
                            <span>Gestión</span>
                            <div className="submenu">
                                <Link to="/comunidades">Comunidades</Link>
                                <Link to="/propiedades">Propiedades</Link>
                                <Link to="/propietarios">Propietarios</Link>
                                <Link to="/incidencias">Incidencias</Link>
                                <div className="menu submenu-item">
                                    <span>Finanzas ▸</span>
                                    <div className="submenu right">
                                        <Link to="/caja">Caja</Link>
                                        <Link to="/banco">Banco</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="menu">
                            <span>Usuarios</span>
                            <div className="submenu">
                                <Link to="/perfil">Perfil</Link>
                                <Link to="/configuracion">Configuración</Link>
                            </div>
                        </div>
                    </>
                )}

                {user?.tipo === 'cliente' && (
                    <>
                        <div className="menu">
                            <span>Propiedades</span>
                            <div className="submenu">
                                <Link to="/propiedades">Ver Propiedades</Link>
                            </div>
                        </div>
                        <div className="menu">
                            <span>Incidencias</span>
                            <div className="submenu">
                                <Link to="/incidencias">Ver Incidencias</Link>
                                <Link to="/incidencias/nueva">Nueva Incidencia</Link>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="navbar-right">
                <Link to="/login" onClick={handleLogout} className="logout">Cerrar Sesión</Link>
            </div>
        </nav>
    );
};

export default Navbar;
