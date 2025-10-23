// services/ComunidadesServices.js
import axios from 'axios';

const API_COMUNIDADES = 'http://localhost:3001/api/comunidades'; // URL base de la API de comunidades

// Obtener todas las comunidades
export const getComunidades = async () => {
    try {
        const token = localStorage.getItem('authToken'); // Obtén el token de autenticación desde el almacenamiento local
        console.log('Token en localStorage:', token);
        const response = await axios.get(API_COMUNIDADES, {
            headers: {
                Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
            },
        });
        console.log('Llamando a:', API_COMUNIDADES);
        console.log('Datos recibidos:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error en getComunidades:', error.message);
        throw error; // Propaga el error para que pueda ser manejado en el componente
    }
};

// Crear una nueva comunidad
export const createComunidad = async (data) => {
    try {
        const response = await axios.post(API_COMUNIDADES, data);
        if (response && response.status === 201) {
            return response.data; // Devuelve la comunidad creada
        } else {
            throw new Error('Error al crear comunidad: Respuesta inválida de la API.');
        }
    } catch (error) {
        console.error('Error en createComunidad:', error.message);
        throw error;
    }
};

// Actualizar una comunidad existente
export const updateComunidad = async (id, data) => {
    try {
        const response = await axios.put(`${API_COMUNIDADES}/${id}`, data);
        if (response && response.status === 200) {
            return response.data; // Devuelve la comunidad actualizada
        } else {
            throw new Error('Error al actualizar comunidad: Respuesta inválida de la API.');
        }
    } catch (error) {
        console.error('Error en updateComunidad:', error.message);
        throw error;
    }
};

// Eliminar una comunidad
export const deleteComunidad = async (id) => {
    try {
        const response = await axios.delete(`${API_COMUNIDADES}/${id}`);
        if (response && response.status === 200) {
            return response.data; // Devuelve la respuesta de eliminación
        } else {
            throw new Error('Error al eliminar comunidad: Respuesta inválida de la API.');
        }
    } catch (error) {
        console.error('Error en deleteComunidad:', error.message);
        throw error;
    }
};
