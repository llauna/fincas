// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Usuario/Login/Login';
import Dashboard from './components/Usuario/Login/Dashboard';
//import PrivateRoute from './components/Usuario/PrivateRoute';
import Propiedades from "./components/Propiedades/Propiedades";
import Propietarios from "./components/Propietarios/Propietarios";
import Comunidades from "./components/Comunidad/Comunidades";
import Proveedores from "./components/Proveedores/Proveedores";
import Empleados from "./components/Usuario/Usuario";
import Roles from "./components/Roles/Roles";
import Configuracion from './components/Usuario/Configuracion';
import Empresa from './components/Empresa/Empresa';
import AdministradorFincas from "./components/AdministradorFincas/AdministradorFincas";
import Banco from './components/Finanzas/Banco';
import Caja from './components/Finanzas/Caja';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/usuario" element={<Empleados />} />
                <Route path="/empresa" element={<Empresa />} />
                <Route path="/proveedores" element={<Proveedores />} />
                <Route path="/administradorFincas" element={<AdministradorFincas />} />
                <Route path="/propiedades" element={<Propiedades />} />
                <Route path="/propietarios" element={<Propietarios />} />
                <Route path="/comunidades" element={<Comunidades />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="/banco" element={<Banco />} />
                <Route path="/caja" element={<Caja />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;

