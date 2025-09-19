// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Usuario/Login/Login';
import Dashboard from './components/Usuario/Login/Dashboard';
//import PrivateRoute from './components/Usuario/PrivateRoute';
import Propiedades from "./components/Propiedades/Propiedades";
import Propietarios from "./components/Propietarios/Propietarios";
import Comunidades from "./components/Comunidad/Comunidades";
import Perfil from "./components/Usuario/Perfil";
import Configuracion from './components/Usuario/Configuracion';
import Empresa from './components/Usuario/Empresa';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/empresa" element={<Empresa />} />

                <Route path="/propiedades" element={<Propiedades />} />
                <Route path="/propietarios" element={<Propietarios />} />
                <Route path="/comunidades" element={<Comunidades />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;

