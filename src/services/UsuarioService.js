// services/UsuarioService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001';

class UsuarioService {
    static async getUsuarios() {
        const response = await axios.get(`${API_URL}/usuarios`);
        //console.log('Datos obtenidos del backend:', response.data); // Verifica los datos aquí
        return response.data.data;
    }

    static async createUsuario(usuario) {
        const response = await axios.post(`${API_URL}/usuarios`, usuario);
        return response.data;
    }
}

export default UsuarioService;

