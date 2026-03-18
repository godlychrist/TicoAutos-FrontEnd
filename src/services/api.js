/**
 * api.js - Instancia centralizada de Axios para comunicación con el backend.
 *
 * Configura la baseURL apuntando a la API de Laravel y aplica dos interceptores:
 * - Request: inyecta automáticamente el token JWT desde localStorage.
 * - Response: redirige al login si el backend responde 401 (token inválido/expirado).
 */
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Accept': 'application/json',
  },
});

// Interceptor de peticiones: adjuntar token JWT a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas: limpiar sesión y redirigir si el token ya no es válido
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

