// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Usuario/Login/Login';
import Dashboard from './components/Usuario/Login/Dashboard';
import PrivateRoute from './components/Usuario/PrivateRoute';
import Propiedades from "./components/Propiedades/Propiedades";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />

                <Route
                    path="/propiedades"
                    element={
                        <PrivateRoute>
                            <Propiedades />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;

