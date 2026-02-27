<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
    router.push('/vehicles');
};
</script>

<template>
  <div class="messages-page">
    <nav class="top-nav">
      <button @click="goBack" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Volver
      </button>
      <div class="logo">TICO<span>AUTOS</span></div>
    </nav>

    <main class="content">
      <div class="messages-container">
        <div class="sidebar">
          <h2 class="title">Mensajes</h2>
          <div class="empty-inbox">
            <p>No tienes chats activos aún.</p>
          </div>
        </div>
        
        <div class="chat-area">
          <div class="placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="msg-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <h3>Buzón de Mensajería</h3>
            <p>Selecciona un chat para ver la conversación o inicia una pregunta desde el detalle de un vehículo.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.messages-page {
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  padding: 20px;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 0 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: white;
}

.logo {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 2px;
}

.logo span {
  color: #dc2626;
}

.messages-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 70vh;
  display: grid;
  grid-template-columns: 350px 1fr;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.sidebar {
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  padding: 30px;
}

.title {
  font-size: 24px;
  margin-bottom: 30px;
}

.empty-inbox {
  color: rgba(255, 255, 255, 0.3);
  text-align: center;
  margin-top: 50px;
}

.chat-area {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.placeholder {
  text-align: center;
  max-width: 400px;
}

.msg-icon {
  color: rgba(255, 255, 255, 0.05);
  margin-bottom: 20px;
}

.placeholder h3 {
  font-size: 22px;
  margin-bottom: 10px;
}

.placeholder p {
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .messages-container {
    grid-template-columns: 1fr;
  }
  .sidebar {
    display: none;
  }
}
</style>
