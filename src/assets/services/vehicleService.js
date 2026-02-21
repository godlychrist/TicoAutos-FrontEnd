import api from './api.js';

const vehicleService = {
    async getAll() {
        try {
            const response = await api.get('/vehicles');
            const apiVehicles = response.data;
            if (apiVehicles) {
                return apiVehicles.map(v => ({
                    ...v,
                    name: `${v.brand} ${v.model}`,
                    stats: v.stats || { speed: '---', range: '---', power: '---' }
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            throw error;
        }
    },
    async create(vehicleData) {
        const response = await api.post('/vehicles', vehicleData);
        return response.data;
    },
    async update(vehicleData) {
        const response = await api.put(`/vehicles/${vehicleData.id}`, vehicleData);
        return response.data;
    },
    async delete(vehicleId) {
        const response = await api.delete(`/vehicles/${vehicleId}`);
        return response.data;
    }
};

export default vehicleService;