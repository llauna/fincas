// services/PropiedadesService.js

import axios from 'axios';

const API_URL = 'http://localhost:3001/api/propiedades';

// Obtener todas las propiedades
export const getPropiedades = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener propiedades:', error);
        throw error;
    }
};

// Crear una nueva propiedad
export const createPropiedad = async (propiedad) => {
    try {
        const response = await axios.post(API_URL, propiedad);
        return response.data;
    } catch (error) {
        console.error('Error al crear propiedad:', error);
        throw error;
    }
};

// Actualizar una propiedad existente
export const updatePropiedad = async (id, propiedad) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, propiedad);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar propiedad:', error);
        throw error;
    }
};

// Eliminar una propiedad
export const deletePropiedad = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar propiedad:', error);
        throw error;
    }
};