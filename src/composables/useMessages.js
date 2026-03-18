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
            conversations.value = await messageServices.getConversations();
        } catch (err) {
            error.value = "Error al cargar conversaciones";
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    /** Cargar los mensajes de una conversación específica y marcarla como activa */
    const loadConversation = async (id) => {
        if (!id) return;
        loading.value = true;
        error.value = null;
        try {
            // 1. Traer los mensajes
            messages.value = await messageServices.getConversation(id);
            
            // 2. Asegurarse de tener la lista de conversaciones cargada
            if (conversations.value.length === 0) {
                await loadConversations();
            }
            
            // 3. Buscar la conversación actual en la lista para tener los metadatos (avatar, nombre, etc.)
            activeConversation.value = conversations.value.find(c => String(c._id) === String(id));
            
            // 4. Si aún no está, recargar por si es un chat recién creado
            if (!activeConversation.value) {
                await loadConversations();
                activeConversation.value = conversations.value.find(c => String(c._id) === String(id));
            }

            if (!activeConversation.value) {
                console.warn(`Conversación ${id} no encontrada en el Inbox.`);
            }
        } catch (err) {
            console.error("Error al cargar la conversacion", err);
            error.value = "No tienes permiso para ver este chat o no existe.";
        } finally {
            loading.value = false;
        }
    };

    /** Crear o reutilizar una conversación para un vehículo con un vendedor */
    const createConversation = async (vehicleId, sellerId) => {
        loading.value = true;
        error.value = null;
        try {
            return await messageServices.createConversation(vehicleId, sellerId);
        } catch (err) {
            console.error("Error al crear la conversacion: ", err)
        } finally {
            loading.value = false;
        }
    };

    /**
     * Enviar un mensaje y recargar la conversación para reflejar el nuevo mensaje.
     * Retorna true si se envió correctamente, undefined si hubo error.
     */
    const sendMessage = async (conversationId, message) => {
        loading.value = true;
        error.value = null;
        try {
            await messageServices.sendMessage(conversationId, message);
            await loadConversation(conversationId); // Refrescar los mensajes
            return true;
        } catch (err) {
            console.error("Error al mandar mensaje: ", err);
            error.value = err.response?.data?.message;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Atajo: crear/reutilizar conversación y navegar directamente al chat.
     * Usado desde las tarjetas y detalle de vehículo (botón "Preguntar").
     */
    const startChat = async (vehicleId, sellerId) => {
        const conversation = await createConversation(vehicleId, sellerId);
        if (conversation) {
            router.push({
                name: 'messages',
                query: { id: conversation._id }
            });
        }
    };

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