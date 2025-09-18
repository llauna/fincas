// services/AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001';

class AuthService {
    static async login(email, password) {
        const response = await axios.post(`${API_URL}/login`, {email, password});
        const {token} = response.data;

        if (token) {
            localStorage.setItem('token', token); // Guarda el token en localStorage
        }

        return response.data;
    }

    static logout() {
        localStorage.removeItem('token'); // Elimina el token
    }

    static isAuthenticated() {
        return !!localStorage.getItem('token'); // Verifica si hay un token
    }
}


export default AuthService;
