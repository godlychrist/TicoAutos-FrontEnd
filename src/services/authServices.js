/**
 * authServices.js - Capa de servicio para autenticación.
 *
 * Encapsula las llamadas HTTP de registro y login.
 * Retorna directamente los datos de la respuesta (response.data).
 */
import api from './api';

/** Registrar un nuevo usuario en el sistema */
const register = async (user) => {
    const response = await api.post('/register', user);
    return response.data;
};

/** Iniciar sesión y obtener el token JWT + datos del usuario */
const login = async (user) => {
    const response = await api.post('/login', user);
    return response.data;
};

export default {
    register,
    login
};