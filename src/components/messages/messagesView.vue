<script setup>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMessages } from '@/composables/useMessages';

const router = useRouter();
const route = useRoute();
const { 
  loadConversations, 
  conversations, 
  loading, 
  loadConversation, 
  activeConversation,
  messages,
  sendMessage,
  error
} = useMessages();

const currentUserId = localStorage.getItem('userId');

const newMessage = ref('');

const goBack = () => {
    router.push('/vehicles');
};

onMounted(async () => {
  await loadConversations();
  if (route.query.id) {
    await loadConversation(route.query.id);
  }
});

const selectConversation = async (id) => {
  await loadConversation(id);
  router.push({ query: { id } });
};

const handleSendMessage = async () => {
  if (!newMessage.value.trim() || !activeConversation.value) return;
  
  const sent = await sendMessage(activeConversation.value._id, newMessage.value);
  if (sent) {
    newMessage.value = '';
  } else {
    // Limpia el error después de 3 segundos
    setTimeout(() => { if(error) error.value = null; }, 3000);
  }
};
</script>

<template>
  <div class="messages-page">
    <!-- Alerta de Error Premium -->
    <Transition name="pop">
      <div v-if="error" class="error-toast">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="error-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span>{{ error }}</span>
      </div>
    </Transition>
    <nav class="top-nav">
      <button @click="goBack" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Volver
      </button>
      <div class="logo">TICO<span>AUTOS</span></div>
    </nav>

    <main class="content">
      <div class="messages-container">
        <!-- BARRA LATERAL: LISTA DE CHATS -->
        <aside class="sidebar">
          <div class="sidebar-header">
            <h2 class="title">Mis Mensajes</h2>
          </div>
          
          <div class="conversations-list">
            <div v-if="loading && !conversations.length" class="loading-state">Cargando chats...</div>

            <div 
              v-for="conv in conversations" 
              :key="conv._id" 
              class="conv-item"
              :class="{ active: activeConversation?._id === conv._id }"
              @click="selectConversation(conv._id)"
            >
              <div class="avatar">
                {{ conv.seller_id ? 'V' : 'C' }}
              </div>
              <div class="conv-info">
                <div class="conv-header">
                  <span class="conv-name">Conversación #{{ (conv._id || '').substring(0,4) }}</span>
                </div>
                <p class="conv-last-msg">
                  {{ conv.last_message || 'Inicia la conversación aquí...' }}
                </p>
              </div>
            </div>

            <div v-if="!loading && conversations.length === 0" class="empty-inbox">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="msg-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <p>No tienes chats activos aún.</p>
            </div>
          </div>
        </aside>
        
        <!-- ÁREA DE CHAT (DERECHA) -->
        <section class="chat-area">
          <div v-if="activeConversation" class="chat-main">
            <header class="chat-header">
              <div class="avatar sm">
                {{ activeConversation.seller_id ? 'V' : 'C' }}
              </div>
              <div class="chat-meta">
                <h3>Vendedor #{{ (activeConversation._id || '').substring(0,4) }}</h3>
                <p class="status">Chat Activo</p>
              </div>
            </header>

            <div class="messages-thread">
              <!-- Mensaje de Bienvenida si no hay mensajes -->
              <div v-if="messages.length === 0" class="welcome-hint">
                <div class="hint-card">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  <p>Aún no hay mensajes en esta conversación. ¡Sé el primero en escribir!</p>
                </div>
              </div>

              <!-- Hilo de Mensajes Real -->
              <div 
                v-for="msg in messages" 
                :key="msg._id"
                class="msg-wrapper"
                :class="String(msg.sender_id) === String(currentUserId) ? 'sent' : 'received'"
              >
                <div class="bubble">
                  {{ msg.message }}
                </div>
                <span class="msg-time">Entregado</span>
              </div>
            </div>

            <footer class="chat-input-area">
              <input 
                v-model="newMessage"
                type="text" 
                placeholder="Escribe un mensaje..." 
                class="message-input"
                @keyup.enter="handleSendMessage"
              />
              <button @click="handleSendMessage" class="send-btn" :disabled="!newMessage.trim()">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </footer>
          </div>

          <div v-else class="placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="msg-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <h3>Buzón de Mensajería</h3>
            <p>Selecciona una conversación de la lista para ver el historial o responder.</p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped src="../../assets/styles/messagesViewScoped.css"></style>
