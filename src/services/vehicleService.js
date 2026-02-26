import api from './api';

const getAll = async () => {
    const response = await api.get('/vehicles');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
};

const create = async (vehicle) => {
    const response = await api.post('/vehicles', vehicle);
    return response.data;
};

const update = async (id, vehicle) => {
    const response = await api.post(`/vehicles/${id}`, vehicle);
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
};

export default {
    getAll,
    getById,
    create,
    update,
    remove
};
