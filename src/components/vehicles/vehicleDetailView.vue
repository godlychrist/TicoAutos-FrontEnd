<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVehicles } from '@/composables/useVehicles.js';

const route = useRoute();
const router = useRouter();
const { getVehicleById, imageUrl, loading } = useVehicles();

const vehicle = ref(null);
const showCopiedMessage = ref(false);

const isAvailable = computed(() => vehicle.value?.status === 'available');

onMounted(async () => {
  const id = route.params.id;
  vehicle.value = await getVehicleById(id);
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price);
};

const handleShare = () => {
  const shareUrl = window.location.href;
  navigator.clipboard.writeText(shareUrl).then(() => {
    showCopiedMessage.value = true;
    setTimeout(() => {
      showCopiedMessage.value = false;
    }, 2000);
  });
};

const goBack = () => {
  router.push('/vehicles');
};
</script>

<template>
  <div class="detail-page">
    <nav class="detail-nav">
      <button @click="goBack" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Volver
      </button>
      <div class="logo">TICO<span>AUTOS</span></div>
    </nav>

    <div v-if="loading" class="loader-container">
      <div class="loader"></div>
    </div>

    <main v-else-if="vehicle" class="detail-content">
      <div class="detail-grid">
        <!-- Imagen -->
        <div class="image-section">
          <div class="image-wrapper">
            <img :src="imageUrl(vehicle.image)" :alt="vehicle.model" class="main-image">
            <div :class="['status-badge', vehicle.status]">
              {{ isAvailable ? 'Disponible' : 'Vendido' }}
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="info-section">
          <div class="specs-card">
            <span class="brand-tag">{{ vehicle.brand }}</span>
            <h1 class="model-title">{{ vehicle.model }}</h1>
            <div class="year-price">
              <span class="year">{{ vehicle.year }}</span>
              <span class="price">{{ formatPrice(vehicle.price) }}</span>
            </div>

            <div class="divider"></div>

            <!-- Propietario -->
            <div class="owner-info">
              <span class="label">Propietario</span>
              <div class="owner-card">
                <div class="avatar">{{ (vehicle.user?.name || vehicle.user?.username || 'V')[0].toUpperCase() }}</div>
                <div class="owner-name">
                  {{ vehicle.user?.name || vehicle.user?.username || 'Vendedor Anónimo' }}
                </div>
              </div>
            </div>

            <div class="actions">
              <button class="reserve-btn" :disabled="!isAvailable">
                {{ isAvailable ? 'RESERVAR AHORA' : 'VENDIDO' }}
              </button>
              
              <div class="share-container">
                <button class="share-btn" @click="handleShare">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  COMPARTIR
                </button>
                <transition name="fade">
                  <span v-if="showCopiedMessage" class="copied-toast">¡Enlace Copiado!</span>
                </transition>
              </div>
            </div>
          </div>

          <!-- Preguntas -->
          <div class="questions-section">
            <h2 class="section-title">Preguntas y Respuestas</h2>
            <div class="empty-questions">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="msg-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <p>Aún no hay preguntas para este vehículo.</p>
              <button class="ask-btn">Hacer una pregunta</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style src="../../assets/styles/details.css" scoped></style>
