import axios from 'axios';

// Crear instancia de axios
const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Añadir interceptor para incluir el token de autenticación
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Asegúrate de que el token se guarda así al hacer login
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Manejar respuestas no autorizadas
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Redirigir al login si el token es inválido o ha expirado
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getEmpresas = async () => {
    try {
        const response = await api.get('/empresas');
        return response.data;
    } catch (error) {
        console.error('Error al obtener empresas:', error);
        throw error;
    }
};

export const getComunidades = async () => {
    try {
        const response = await api.get('/comunidades');
        return response.data;
    } catch (error) {
        console.error('Error al obtener comunidades:', error);
        throw error;
    }
};

export const getPropietarios = async () => {
    try {
        const response = await api.get('/propietarios');
        return response.data;
    } catch (error) {
        console.error('Error al obtener propietarios:', error);
        throw error;
    }
};

export const createPropietario = async (data) => {
    try {
        const response = await api.post('/propietarios', data);
        return response.data;
    } catch (error) {
        console.error('Error al crear propietario:', error);
        throw error;
    }
};

export const updatePropietario = async (id, data) => {
    try {
        const response = await api.put(`/propietarios/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar propietario:', error);
        throw error;
    }
};

export const deletePropietario = async (id) => {
    try {
        await api.delete(`/propietarios/${id}`);
    } catch (error) {
        console.error('Error al eliminar propietario:', error);
        throw error;
    }
};
