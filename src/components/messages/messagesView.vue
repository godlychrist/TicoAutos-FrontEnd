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
  background: transparent;
  color: var(--text-main);
  padding: 24px;
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
  background: var(--glass);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 600;
  font-family: 'Outfit', sans-serif;
}

.back-btn:hover {
  background: var(--black-cherry-dark);
  border-color: var(--black-cherry);
  color: white;
  transform: translateX(-4px);
}

.logo {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 4px;
}

.logo span {
  background: linear-gradient(135deg, var(--black-cherry-glow), var(--black-cherry-vibrant));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px rgba(139, 26, 74, 0.4));
}

.messages-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 70vh;
  display: grid;
  grid-template-columns: 320px 1fr;
  background: rgba(12, 12, 16, 0.5);
  border-radius: var(--radius-xl);
  border: 1px solid var(--glass-border);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.sidebar {
  border-right: 1px solid var(--glass-border);
  padding: 30px;
}

.title {
  font-size: 1.4rem;
  margin-bottom: 30px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.empty-inbox {
  color: var(--text-dim);
  text-align: center;
  margin-top: 50px;
  font-size: 0.9rem;
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
  color: rgba(74, 13, 43, 0.15);
  margin-bottom: 24px;
}

.placeholder h3 {
  font-size: 1.3rem;
  margin-bottom: 12px;
  font-weight: 700;
}

.placeholder p {
  color: var(--text-muted);
  line-height: 1.7;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .messages-container {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 50vh;
  }
  .sidebar {
    display: none;
  }
}
</style>
