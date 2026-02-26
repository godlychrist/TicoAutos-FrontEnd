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
  getVehicles,
  brands,
  filters,
  resetFilters,
  pagination
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
        <button class="messages-nav-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          <span>Mensajes</span>
        </button>
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

      <div v-if="vehicles.length > 0" class="vehicles-grid">
        <vehicleCard 
          v-for="(vehicle, index) in vehicles" 
          :key="vehicle.id || index" 
          :vehicle="vehicle"
          :index="index"
        />
      </div>

      <!-- Paginación -->
      <div v-if="vehicles.length > 0" class="pagination">
        <button class="pagination-btn" @click="getVehicles(pagination.current_page - 1)" :disabled="pagination.current_page <= 1">
            ← Anterior
        </button>
        <div class="pagination-info">
          <span class="page-current">{{ pagination.current_page }}</span>
          <span class="page-separator">de</span>
          <span class="page-total">{{ pagination.last_page }}</span>
        </div>
        <button class="pagination-btn" @click="getVehicles(pagination.current_page + 1)" :disabled="pagination.current_page >= pagination.last_page">
            Siguiente →
        </button>
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
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 40px;
    padding: 20px 0;
}

.pagination-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    padding: 10px 24px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
    background: #dc2626;
    border-color: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
}

.pagination-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.pagination-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
}

.page-current {
    color: #dc2626;
    font-weight: 700;
    font-size: 1.1rem;
}

.page-separator {
    color: #555;
}

.page-total {
    color: white;
    font-weight: 600;
}

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
