// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsuarioList from './components/Usuario/UsuarioList';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UsuarioList />} />
            </Routes>
        </Router>
    );
};

export default App;
