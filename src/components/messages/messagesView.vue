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

<style scoped src="../../assets/styles/messagesViewScoped.css"></style>
