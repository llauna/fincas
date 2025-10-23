// controllers/propietarioController.js
const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

// Función para obtener token (compatible navegador/Node)
const getToken = () => {
    if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('token');
    }
    return process.env.TOKEN || '';
};

// Crear un propietario
export const createPropietario = async (data) => {
    try {
        const token = getToken();
        const response = await axios.post(`${API_BASE_URL}/propietarios`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear propietario:', error.response?.data || error.message);
        throw error;
    }
};

// Obtener todos los propietarios
export const getPropietarios = async () => {
    try {
        const token = getToken();
        const response = await axios.get(`${API_BASE_URL}/propietarios`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener propietarios:', error.response?.data || error.message);
        throw error;
    }
};

// Obtener un propietario por ID
export const getPropietarioById = async (id) => {
    try {
        const token = getToken();
        const response = await axios.get(`${API_BASE_URL}/propietarios/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener propietario:', error.response?.data || error.message);
        throw error;
    }
};

// Actualizar un propietario
export const updatePropietario = async (id, data) => {
    try {
        const token = getToken();
        const response = await axios.put(`${API_BASE_URL}/propietarios/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar propietario:', error.response?.data || error.message);
        throw error;
    }
};

// Eliminar un propietario
export const deletePropietario = async (id) => {
    try {
        const token = getToken();
        const response = await axios.delete(`${API_BASE_URL}/propietarios/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar propietario:', error.response?.data || error.message);
        throw error;
    }
};

// Obtener empresas
export const getEmpresas = async () => {
    try {
        const token = getToken();
        const response = await axios.get(`${API_BASE_URL}/empresas`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener empresas:', error.response?.data || error.message);
        throw error;
    }
};

// Obtener comunidades
export const getComunidades = async () => {
    try {
        const token = getToken();
        const response = await axios.get(`${API_BASE_URL}/comunidades`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener comunidades:', error.response?.data || error.message);
        throw error;
    }
};
