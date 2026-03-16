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
                :class="msg.sender_id === activeConversation.buyer_id ? 'sent' : 'received'"
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

<style scoped>
.messages-page {
  min-height: 100vh;
  background: var(--bg-main);
  color: var(--text-main);
  padding: 40px 24px;
  position: relative;
}

/* Estilos de la Alerta (Toast) */
.error-toast {
  position: fixed;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #950e2a 0%, #4a0d2b 100%);
  color: white;
  padding: 14px 28px;
  border-radius: 20px;
  z-index: 2000;
  box-shadow: 0 15px 35px rgba(0,0,0,0.5), 0 0 20px rgba(149, 14, 42, 0.4);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.error-icon {
  color: #ff8fa3;
}

/* Animación Pop */
.pop-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-leave-active {
  transition: all 0.3s ease-in;
}
.pop-enter-from {
  opacity: 0;
  transform: translate(-50%, -40px) scale(0.8);
}
.pop-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px) scale(0.9);
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto 30px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--glass);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.back-btn:hover {
  background: var(--black-cherry-dark);
  color: white;
  transform: translateX(-5px);
}

.logo {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 3px;
}

.logo span {
  color: var(--black-cherry);
}

/* Contenedor Principal */
.messages-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 75vh;
  display: grid;
  grid-template-columns: 350px 1fr;
  background: rgba(15, 15, 20, 0.6);
  border-radius: var(--radius-xl);
  border: 1px solid var(--glass-border);
  overflow: hidden;
  backdrop-filter: blur(15px);
  box-shadow: 0 25px 50px rgba(0,0,0,0.4);
}

/* Sidebar Estilos */
.sidebar {
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
}

.sidebar-header {
  padding: 25px;
  border-bottom: 1px solid var(--glass-border);
}

.title {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.loading-state {
  text-align: center;
  padding: 20px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.conv-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
  border: 1px solid transparent;
}

.conv-item:hover {
  background: rgba(149, 14, 42, 0.08);
}

.conv-item.active {
  background: rgba(149, 14, 42, 0.15);
  border-color: rgba(149, 14, 42, 0.3);
}

.avatar {
  width: 48px;
  height: 48px;
  background: var(--black-cherry-gradient);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(139, 26, 74, 0.3);
}

.avatar.sm {
  width: 36px;
  height: 36px;
  font-size: 0.8rem;
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-name {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-main);
  margin-bottom: 4px;
}

.conv-last-msg {
  font-size: 0.85rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-area {
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at center, rgba(149, 14, 42, 0.03), transparent);
  height: 100%;
  overflow: hidden;
}

.chat-main {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 15px 25px;
  background: rgba(0,0,0,0.2);
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  gap: 15px;
}

.chat-meta h3 {
  font-size: 1rem;
  font-weight: 600;
  color: white;
}

.status {
  font-size: 0.75rem;
  color: var(--black-cherry-glow);
}

.messages-thread {
  flex: 1;
  overflow-y: auto;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: 0; /* Importante para flexbox */
}

.welcome-hint {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hint-card {
  background: var(--glass);
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  max-width: 300px;
  color: var(--text-muted);
  border: 1px solid var(--glass-border);
}

.hint-card svg {
  margin-bottom: 15px;
  opacity: 0.3;
}

.msg-wrapper {
  max-width: 75%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.msg-wrapper.sent {
  align-self: flex-end;
  align-items: flex-end;
}

.msg-wrapper.received {
  align-self: flex-start;
  align-items: flex-start;
}

.bubble {
  padding: 12px 18px;
  border-radius: 20px;
  font-size: 0.95rem;
  line-height: 1.5;
}

.sent .bubble {
  background: var(--black-cherry);
  color: white;
  border-bottom-right-radius: 4px;
}

.received .bubble {
  background: var(--glass-light);
  border: 1px solid var(--glass-border);
  border-bottom-left-radius: 4px;
}

.msg-time {
  font-size: 0.7rem;
  color: var(--text-dim);
}

.chat-input-area {
  padding: 20px 25px;
  background: rgba(0,0,0,0.3);
  border-top: 1px solid var(--glass-border);
  display: flex;
  gap: 15px;
}

.message-input {
  flex: 1;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--glass-border);
  padding: 12px 20px;
  border-radius: 14px;
  color: white;
  outline: none;
  font-family: inherit;
  transition: 0.3s;
}

.message-input:focus {
  border-color: var(--black-cherry);
  background: rgba(255,255,255,0.1);
}

.send-btn {
  width: 48px;
  height: 48px;
  background: var(--black-cherry);
  color: white;
  border: none;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
}

.send-btn:hover:not(:disabled) {
  background: var(--black-cherry-vibrant);
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
}

@media (max-width: 900px) {
  .messages-container {
    grid-template-columns: 1fr;
    height: 85vh;
  }
}
</style>
