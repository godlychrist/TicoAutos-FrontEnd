<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVehicles } from '@/composables/useVehicles.js';
import { useMessages } from '@/composables/useMessages.js';

const { startChat } = useMessages();

const route = useRoute();
const router = useRouter();
const { getVehicleById, imageUrl, loading, updateVehicleStatus } = useVehicles();

const vehicle = ref(null);
const showCopiedMessage = ref(false);

const isAvailable = computed(() => vehicle.value?.status === 'available');

// Obtener el usuario actual para verificar propiedad
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
const currentUserId = currentUser._id || currentUser.id || currentUser.ID;

const isOwner = computed(() => {
  const vehicleUserId = vehicle.value?.user_id || vehicle.value?.userId;
  return currentUserId && vehicleUserId && String(currentUserId) === String(vehicleUserId);
});

const handleStatusToggle = async () => {
    const newStatus = vehicle.value.status === 'available' ? 'sold' : 'available';
    const success = await updateVehicleStatus(vehicle.value._id || vehicle.value.id, newStatus);
    if (success) {
        // Actualizar localmente para no recargar todo
        vehicle.value.status = newStatus;
    }
};

const goToMessages = () => {
  startChat(vehicle.value._id, vehicle.value.user_id);
};

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
              <!-- Si es el dueño -->
              <button 
                v-if="isOwner" 
                class="reserve-btn toggle" 
                @click="handleStatusToggle"
                :class="vehicle.status"
              >
                {{ isAvailable ? 'MARCAR COMO VENDIDO' : 'MARCAR DISPONIBLE' }}
              </button>

              <!-- Si es visitante -->
              <button 
                v-else 
                class="reserve-btn" 
                @click="goToMessages"
                :disabled="!isAvailable"
              >
                {{ isAvailable ? 'HACER UNA PREGUNTA' : 'VENDIDO' }}
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
        </div>
      </div>
    </main>
  </div>
</template>

<style src="../../assets/styles/details.css" scoped></style>
