//App.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Shared/Navbar';
import Login from './components/Usuario/Login/Login';
import Dashboard from './components/Usuario/Login/Dashboard';
import Propiedades from "./components/Propiedades/Propiedades";
import Propietarios from "./components/Propietarios/Propietarios";
import Comunidades from "./components/Comunidad/Comunidades";
import Proveedores from "./components/Proveedores/Proveedores";
import ProveedorFacturas from './components/Proveedores/ProveedorFacturas';
import Empleados from "./components/Usuario/Usuario";
import Roles from "./components/Roles/Roles";
import Configuracion from './components/Usuario/Configuracion';
import Empresa from './components/Empresa/Empresa';
import AdministradorFincas from "./components/AdministradorFincas/AdministradorFincas";
import Banco from './components/Finanzas/Banco';
import Movimientos from './components/Finanzas/Movimientos';
import Caja from './components/Finanzas/Caja';
import ListaCajas from './components/Finanzas/ListaCajas';
import ListaMovimientosGlobal from './components/Finanzas/ListaMovimientosGlobal';
import Perfil from './components//Perfil';
import EditarUsuario from './components/Usuario/EditarUsuario';
import ConfiguracionRoles from './components/Roles/ConfiguracionRoles';
import ListaIncidencias from './components/Incidencias/ListaIncidencias';
import AbrirIncidencia from './components/Incidencias/AbrirIncidencia';


export default function App()  {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const hideNavbar = location.pathname === "/login"; // Ocultar navbar en login

    return (
        <>
            {!hideNavbar && <Navbar />}
            <div className="main-content">
                <Routes>
                    <Route path="/login" element={<Login />} />

                    {/* Dashboard principal */}
                    <Route path="/dashboard" element={<Dashboard token={token} />} />

                    {/* Administración de usuarios */}
                    <Route path="/perfil" element={<Perfil token={token} />} />
                    <Route path="/editar/:id" element={<EditarUsuario token={token} />} />

                    <Route path="/usuario" element={<Empleados />} />
                    <Route path="/empresa" element={<Empresa />} />
                    <Route path="/proveedores" element={<Proveedores />} />
                    <Route path="/proveedores/:id" element={<ProveedorFacturas />} />
                    <Route path="/administradorFincas" element={<AdministradorFincas />} />
                    <Route path="/propiedades" element={<Propiedades />} />
                    <Route path="/propietarios" element={<Propietarios />} />
                    <Route path="/comunidades" element={<Comunidades />} />
                    <Route path="/roles" element={<Roles />} />
                    <Route path="/configuracion" element={<Configuracion />} />

                    {/* Configuración - Gestión de roles */}
                    <Route path="/configuracion/roles" element={<ConfiguracionRoles token={localStorage.getItem('token')} />} />

                    <Route path="/banco" element={<Banco />} />
                    <Route path="/lista-cajas" element={<ListaCajas />} />
                    <Route path="/movimientos-globales" element={<ListaMovimientosGlobal />} />
                    <Route path="/movimientos" element={<Movimientos />} />
                    <Route path="/movimientos/:bancoId" element={<Movimientos />} />

                    {/* Ruta para ver incidencias */}
                    <Route path="/incidencias/:propietarioId" element={token ? <ListaIncidencias /> : <Navigate to="/login" />} />

                    {/* Ruta para abrir una nueva incidencia */}
                    <Route path="/incidencias/abrir/:propietarioId" element={token ? <AbrirIncidencia /> : <Navigate to="/login" />} />

                    <Route path="/caja" element={<Caja />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </>
    );
};