// services/AdministradorFincasService.js

import axios from 'axios';

// La URL de tu API para los administradores de fincas.
// Asegúrate de que esta ruta coincida con la que definirás en tu backend.
const API_URL = 'http://localhost:3001/api/administradorfincas';

// Obtener todos los administradores de fincas
export const getAdministradoresFincas = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener administradores de fincas:', error);
        throw error;
    }
};

// Crear un nuevo administrador de fincas
export const createAdministradorFincas = async (administrador) => {
    try {
        const response = await axios.post(API_URL, administrador);
        return response.data;
    } catch (error) {
        console.error('Error al crear administrador de fincas:', error);
        throw error;
    }
};

// Actualizar un administrador de fincas existente
export const updateAdministradorFincas = async (id, administrador) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, administrador);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar administrador de fincas:', error);
        throw error;
    }
};

// Eliminar un administrador de fincas
export const deleteAdministradorFincas = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar administrador de fincas:', error);
        throw error;
    }
};