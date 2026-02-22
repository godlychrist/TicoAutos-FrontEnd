import api from './api.js';

const vehicleService = {

    async create(vehicleData) {
        const response = await api.post('/vehicles', vehicleData);
        return response.data;
    },
    async update(vehicleData) {
        const id = vehicleData._id || vehicleData.id;
        const response = await api.put(`/vehicles/${id}`, vehicleData);
        return response.data;
    },
    async delete(vehicleId) {
        const response = await api.delete(`/vehicles/${vehicleId}`);
        return response.data;
    }
};

export default vehicleService;