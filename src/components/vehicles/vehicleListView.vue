<script setup>
import { onMounted } from 'vue';
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
  getVehicles,
  brands,
  filters,
  resetFilters
} = useVehicles();

onMounted(() => {
    getVehicles();
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
        <button class="logout-btn" @click="handleLogout">Salir</button>
      </div>
    </nav>

    <main class="content">
      <header class="page-header">
        <div class="title-section">
          <span class="subtitle">Nuestra Flota</span>
          <h1 class="main-title">Vehículos Exclusivos</h1>
        </div>
        
        <button @click="openModal(null)" class="create-btn">
          <span class="plus-icon">+</span> Crear Vehículo
        </button>
      </header>

      <!-- Barra de Búsqueda y Filtros -->
      <div class="search-filters-bar">
        <div class="search-input-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" class="search-input" placeholder="Buscar por modelo..." v-model="filters.search">
        </div>

        <div class="filter-controls">
          <select class="filter-select" v-model="filters.brand">
            <option value="">Todas las marcas</option>
            <option v-for="brand in brands" :key="brand">{{ brand }}</option>
          </select>

          <div class="year-range">
            <input type="number" class="filter-input-small" placeholder="Año mín" min="1990" max="2030" v-model="filters.year_min">
            <span class="range-separator">—</span>
            <input type="number" class="filter-input-small" placeholder="Año máx" min="1990" max="2030" v-model="filters.year_max">
          </div>

          <select class="filter-select" v-model="filters.status">
            <option value="">Estado</option>
            <option value="available">Disponible</option>
            <option value="sold">Vendido</option>
          </select>

          <select class="filter-select" v-model="filters.price_range">
            <option value="">Todos los precios</option>
            <option value="0-10000">Menos de $10,000</option>
            <option value="10000-25000">$10,000 - $25,000</option>
            <option value="25000-50000">$25,000 - $50,000</option>
            <option value="50000-100000">$50,000 - $100,000</option>
            <option value="100000-999999999">Más de $100,000</option>
          </select>

          <button class="search-btn" @click="getVehicles">Buscar</button>
          <button class="clear-filters-btn" @click="resetFilters">Limpiar</button>
        </div>
      </div>
      
      <!-- El modal ahora usa el estado compartido -->
      <vehicleCreateModal v-if="isModalOpen" @create="getVehicles"/>

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
