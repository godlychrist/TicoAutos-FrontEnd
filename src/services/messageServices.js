import api from './api';

// Peticiones al servidor para Chats y Mensajes

const getConversation = async (id) => {
    const response = await api.get(`/conversations/${id}`); // Trae mensajes de un chat
    return response.data;
};

const getConversations = async () => {
    const response = await api.get(`/conversations`); // Trae todos los chats del usuario
    return response.data;
};

const createConversation = async (vehicleId, sellerId) => {
    const response = await api.post(`/conversations`, {
        vehicle_id: vehicleId,
        seller_id: sellerId
    }); // Abre un nuevo chat
    return response.data;
};

const sendMessage = async (conversationId, message) => {
    const response = await api.post(`/messages`, {
        conversation_id: conversationId,
        message: message
    }); // Envía un mensaje a un chat
    return response.data;
}

export default {
    getConversation,
    getConversations,
    createConversation,
    sendMessage
}