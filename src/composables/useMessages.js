/**
 * useMessages.js - Composable de mensajería (Vue 3 Composition API).
 *
 * Gestiona el estado de conversaciones y mensajes del chat.
 * Cada instancia tiene su propio estado (no es singleton como useVehicles),
 * lo que permite múltiples usos independientes si fuera necesario.
 */
import { ref } from 'vue';
import messageServices from '@/services/messageServices';
import { useRouter } from 'vue-router';

export function useMessages() {

    const conversations = ref([]);
    const messages = ref([]);
    const activeConversation = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const router = useRouter();

    /** Cargar la lista de todas las conversaciones del usuario autenticado */
    const loadConversations = async () => {
        loading.value = true;
        error.value = null;

        try {
            const data = await messageServices.getConversations();
            conversations.value = data;
        } catch (err) {
            error.value = "Error al cargar conversaciones";
            console.error(err);
        } finally {
            loading.value = false;
        }

    }

    /** Cargar los mensajes de una conversación específica y marcarla como activa */
    const loadConversation = async (id) => {
        loading.value = true;
        error.value = null;

        try {
            const data = await messageServices.getConversation(id);
            messages.value = data;
            activeConversation.value = conversations.value.find(c => c._id === id);
        } catch (err) {
            console.error("Error al cargar la conversacion", err);
        } finally {
            loading.value = false;
        }
    };

    /** Crear o reutilizar una conversación para un vehículo con un vendedor */
    const createConversation = async (vehicleId, sellerId) => {
        loading.value = true;
        error.value = null;

        try {
            const data = await messageServices.createConversation(vehicleId, sellerId);
            return data;
        } catch (err) {
            console.error("Error al crear la conversacion: ", err)
        } finally {
            loading.value = false;
        }
    }

    /**
     * Enviar un mensaje y recargar la conversación para reflejar el nuevo mensaje.
     * Retorna true si se envió correctamente, undefined si hubo error.
     */
    const sendMessage = async (conversationId, message) => {
        loading.value = true;
        error.value = null;

        try {
            await messageServices.sendMessage(conversationId, message);
            await loadConversation(conversationId);
            return true;

        } catch (err) {
            console.error("Error al mandar mensaje: ", err);
            error.value = err.response?.data?.message;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Atajo: crear/reutilizar conversación y navegar directamente al chat.
     * Usado desde las tarjetas y detalle de vehículo (botón "Preguntar").
     */
    const startChat = async (vehicleId, sellerId) => {
        const conversation = await createConversation(vehicleId, sellerId);
        if (conversation) {
            router.push({
                name: 'messages',
                query: {
                    id: conversation._id
                }
            });
        }
    }


    return {
        conversations,
        messages,
        activeConversation,
        loading,
        error,
        loadConversations,
        loadConversation,
        createConversation,
        sendMessage,
        startChat
    };
}