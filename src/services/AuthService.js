// services/AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/auth';

class AuthService {
    static async login(email, password) {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    }

    static async register(email, password, rol) {
        const response = await axios.post(`${API_URL}/register`, { email, password, rol });
        return response.data;
    }
}

export default AuthService;
