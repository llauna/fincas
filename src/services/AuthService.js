// services/AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001';

class AuthService {
    static async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            return response.data;
        } catch (error) {
            console.error('Error en la solicitud:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}


export default AuthService;
