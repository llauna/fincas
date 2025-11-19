//components/Shared/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');  // Cambiado de 'authToken' a 'token'
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
                                <div className="admin-menu">
                                    <span>Administración ▸</span>
                                    <div className="admin-submenu">
                                        <Link to="/comunidades">Comunidades</Link>
                                        <Link to="/propiedades">Propiedades</Link>
                                        <Link to="/propietarios">Propietarios</Link>
                                    </div>
                                </div>

                                <div className="submenu-section">
                                    <Link to="/documentacion/actas">Actas de Reuniones</Link>
                                    <Link to="/documentacion/estados-financieros">Estados Financieros</Link>
                                </div>

                                <div className="submenu-section">
                                    <Link to="/incidencias">Incidencias</Link>
                                    <div className="admin-menu">
                                        <span>Finanzas ▸</span>
                                        <div className="admin-submenu">
                                            <Link to="/caja">Caja</Link>
                                            <Link to="/banco">Banco</Link>
                                        </div>
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

                {/* Menú para clientes */}
                {user?.tipo === 'cliente' && (
                    <>
                        <div className="menu">
                            <span>Gestión</span>
                            <div className="submenu">
                                <Link to="/propiedades">Mis Propiedades</Link>
                                <Link to={`/incidencias/${user._id}`}>Mis Incidencias</Link>
                            </div>
                        </div>

                        <div className="menu">
                            <span>Documentacion</span>
                            <div className="submenu">
                                <Link to="/documentacion/actas">Actas de Reuniones</Link>
                                <Link to="/documentacion/estados-financieros">Estados Financieros</Link>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="navbar-right">
                <Link to="/login" onClick={handleLogout} className="logout-btn"><i className="fas fa-sign-out-alt me-2"></i> Cerrar Sesión</Link>
            </div>
        </nav>
    );
};

export default Navbar;
