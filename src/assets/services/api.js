// Configuración de Axios para conexión Frontend-Backend
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // URL de la API Laravel
    timeout: 10000, 
    headers: {
        'Accept': 'application/json' // Definir formato de respuesta esperado
    }
});

// Interceptor para inyectar token JWT en cada petición saliente
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Adjuntar token
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;