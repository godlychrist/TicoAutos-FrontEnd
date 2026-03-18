import { ref } from 'vue';
import messageServices from '@/services/messageServices';
import { useRouter } from 'vue-router';

// Composable: Gestiona el estado y la lógica del Chat/Mensajes
export function useMessages() {
    const conversations = ref([]);
    const messages = ref([]);
    const activeConversation = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const router = useRouter();

    // Carga la lista de chats del usuario (Inbox)
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

    // Carga los mensajes de un chat específico
    const loadConversation = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            messages.value = await messageServices.getConversation(id);
            activeConversation.value = conversations.value.find(c => c._id === id);
        } catch (err) {
            console.error("Error al cargar la conversacion", err);
        } finally {
            loading.value = false;
        }
    };

    // Crea un nuevo chat (si no existe) para un vehículo
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

    // Envía un nuevo mensaje a un chat activo
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

    // Crea un chat y redirige automáticamente a la vista de Mensajes
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