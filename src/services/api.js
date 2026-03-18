// Interceptor global para peticiones Axios (Frontend-Backend)
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Accept': 'application/json',
  },
});

// Interceptor de Salida: Inyecta el Token de sesión en todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Inserta JWT
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Entrada: Maneja errores generales del servidor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si la sesión expiró (401), cierra la sesión automáticamente
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
