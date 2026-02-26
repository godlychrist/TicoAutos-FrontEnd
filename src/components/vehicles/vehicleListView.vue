<script setup>
import { onMounted, ref } from 'vue';
import { useVehicles } from '@/composables/useVehicles.js';
import { useAuth } from '@/composables/useAuth.js';
import vehicleCard from './vehicleCard.vue';
import vehicleCreateModal from './vehicleCreateModal.vue';

// Props y Emits básicos
const { handleLogout } = useAuth();
defineProps({
  username: String
});

// Usamos el estado global del Composable
const {
  vehicles,
  isModalOpen,
  openModal,
  getVehicles
} = useVehicles();

const currentUser = ref('Usuario');

onMounted(() => {
    getVehicles();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    currentUser.value = storedUser.username || storedUser.name || 'Usuario';
});
</script>

<template>
  <div class="vehicles-page">
    <nav class="top-nav">
      <div class="logo-container">
        <img src="../../assets/ferrari-logo.png" alt="Ferrari Logo" class="nav-logo">
        <div class="logo">TICO<span>AUTOS</span></div>
      </div>
      <div class="user-info">
        <span class="username">Hola, {{ currentUser }}</span>
        <button class="logout-btn" @click="handleLogout">Salir</button>
      </div>
    </nav>

    <main class="content">
      <header class="page-header">
        <div class="title-section">
          <span class="subtitle">Nuestra Flota</span>
          <h1 class="main-title">Vehículos Exclusivos</h1>
        </div>
        
        <div class="header-actions">
          <div class="filters">
            <button class="filter-btn active">Todos</button>
            <button class="filter-btn">Sedan</button>
            <button class="filter-btn">SUV</button>
            <button class="filter-btn">Sport</button>
          </div>
          <button @click="openModal(null)" class="create-btn">
            <span class="plus-icon">+</span> Crear Vehículo
          </button>
        </div>
      </header>
      
      <!-- El modal ahora usa el estado compartido -->
      <vehicleCreateModal v-if="isModalOpen" @create="getVehicles"/>

      <div v-if="vehicles.length > 0" class="vehicles-grid">
        <vehicleCard 
          v-for="(vehicle, index) in vehicles" 
          :key="vehicle.id || index" 
          :vehicle="vehicle"
          :index="index"
        />
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">🏎️</div>
        <h3>No hay vehículos todavía</h3>
        <p>¡Sé el primero en publicar tu Ferrari exclusivo!</p>
        <button @click="openModal(null)" class="create-btn-empty">Crear Vehículo</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  margin-top: 40px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: white;
  font-size: 24px;
  margin-bottom: 10px;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 30px;
}

.create-btn-empty {
  background: #dc2626;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-btn-empty:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(220, 38, 38, 0.3);
}
</style>

<style src="../../assets/styles/vehicles.css"></style>
