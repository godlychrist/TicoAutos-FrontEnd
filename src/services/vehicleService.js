/**
 * vehicleService.js - Capa de servicio para operaciones CRUD de vehículos.
 *
 * Incluye un workaround para Laravel con FormData: cuando se edita un vehículo
 * con imagen (FormData), se usa POST + _method: PUT (method spoofing),
 * ya que los navegadores no envían archivos correctamente con PUT real.
 */
import api from './api';

/** Obtener lista paginada de vehículos con filtros opcionales */
const getAll = async (filters, page) => {
    const response = await api.get('/vehicles', { params: { ...filters, page } }); // Listar filtrados
    return response.data;
};

/** Obtener un vehículo por su ID */
const getById = async (id) => {
    const response = await api.get(`/vehicles/${id}`); // Traer 1 vehículo
    return response.data;
};

/** Crear un nuevo vehículo (recibe FormData con imagen) */
const create = async (vehicle) => {
    const response = await api.post('/vehicles', vehicle); // Añadir vehículo
    return response.data;
};

/**
 * Actualizar un vehículo existente.
 * Si data es FormData (con imagen), usa POST + method spoofing.
 * Si data es JSON plano (ej. cambio de estado), usa PUT real.
 */
const update = async (id, data) => {
    if (data instanceof FormData) {
        const response = await api.post(`/vehicles/${id}`, data);
        return response.data;
    } else {
        const response = await api.put(`/vehicles/${id}`, data);
        return response.data;
    }
};

/** Eliminar un vehículo por su ID */
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

