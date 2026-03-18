/**
 * messageServices.js - Capa de servicio para el sistema de mensajería.
 *
 * Encapsula las operaciones de conversaciones y mensajes:
 * obtener/crear conversaciones, obtener mensajes de un chat, enviar mensajes.
 */
import api from './api';

/** Obtener todos los mensajes de una conversación específica */
const getConversation = async (id) => {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
};

/** Obtener la lista de todas las conversaciones del usuario autenticado */
const getConversations = async () => {
    const response = await api.get(`/conversations`);
    return response.data;
};

/** Crear o reutilizar una conversación entre comprador y vendedor para un vehículo */
const createConversation = async (vehicleId, sellerId) => {
    const response = await api.post(`/conversations`, {
        vehicle_id: vehicleId,
        seller_id: sellerId
    });
    return response.data;
};

/** Enviar un mensaje dentro de una conversación */
const sendMessage = async (conversationId, message) => {
    const response = await api.post(`/messages`, {
        conversation_id: conversationId,
        message: message
    });
    return response.data;
}

export default {
    getConversation,
    getConversations,
    createConversation,
    sendMessage
}