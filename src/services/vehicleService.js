import api from './api';

// Peticiones HTTP al servidor orientadas a Ventas y Vehículos

const getAll = async (filters, page) => {
    const response = await api.get('/vehicles', { params: { ...filters, page } }); // Listar filtrados
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/vehicles/${id}`); // Traer 1 vehículo
    return response.data;
};

const create = async (vehicle) => {
    const response = await api.post('/vehicles', vehicle); // Añadir vehículo
    return response.data;
};

const update = async (id, data) => {
    if (data instanceof FormData) {
        // Formatos complejos (Imágenes, etc) exigen POST y método PUT inyectado
        const response = await api.post(`/vehicles/${id}`, data);
        return response.data;
    } else {
        // Actualizaciones simples de texto/JSON
        const response = await api.put(`/vehicles/${id}`, data);
        return response.data;
    }
};

const remove = async (id) => {
    const response = await api.delete(`/vehicles/${id}`); // Dar de baja vehículo
    return response.data;
};

export default {
    getAll,
    getById,
    create,
    update,
    remove
};
