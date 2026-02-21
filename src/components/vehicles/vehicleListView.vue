<script setup>
import { onMounted } from 'vue';
import { useVehicles } from '@/composables/useVehicles.js';
import vehicleCard from './vehicleCard.vue';
import vehicleCreateModal from './vehicleCreateModal.vue';

// Props y Emits básicos
defineProps({
  username: String
});
defineEmits(['logout']);

// Usamos el estado global del Composable
const {
  vehicles,
  isModalOpen,
  openModal,
  fetchVehicles
} = useVehicles();

onMounted(() => {
  fetchVehicles();
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
        <span class="username">{{ username || 'Usuario' }}</span>
        <button class="logout-btn" @click="$emit('logout')">Salir</button>
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
      <vehicleCreateModal v-if="isModalOpen" />

      <div class="vehicles-grid">
        <!-- Combinación reactiva de datos reales y mock -->
        <vehicleCard 
          v-for="(vehicle, index) in vehicles" 
          :key="vehicle.id || index" 
          :vehicle="vehicle"
          :index="index"
        />
      </div>
    </main>
  </div>
</template>

<style src="../../assets/styles/vehicles.css"></style>
