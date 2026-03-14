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
const isAuthenticated = ref(false);

onMounted(() => {
    getVehicles();
    const token = localStorage.getItem('token');
    if (token) {
        isAuthenticated.value = true;
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.value = storedUser.username || storedUser.name || 'Usuario';
    }
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
        <template v-if="isAuthenticated">
          <button class="messages-nav-btn" @click="$router.push('/messages')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>Mensajes</span>
          </button>
          <span class="username">Hola, {{ currentUser }}</span>
          <button class="logout-btn" @click="handleLogout">Salir</button>
        </template>
        <template v-else>
          <button class="logout-btn" style="background-color: transparent; border-color: rgba(255,255,255,0.4);" @click="$router.push('/login')">Iniciar Sesión</button>
        </template>
      </div>
    </nav>

    <main class="content">
      <header class="page-header">
        <div class="title-section">
          <span class="subtitle">Nuestra Flota</span>
          <h1 class="main-title">Vehículos Exclusivos</h1>
        </div>
        
        <button v-if="isAuthenticated" @click="openModal(null)" class="create-btn">
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
        <button v-if="isAuthenticated" @click="openModal(null)" class="create-btn-empty">Crear Vehículo</button>
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
    background: var(--glass);
    border: 1px solid var(--glass-border);
    color: var(--text-secondary);
    padding: 10px 24px;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: var(--transition);
    font-family: 'Outfit', sans-serif;
}

.pagination-btn:hover:not(:disabled) {
    background: var(--black-cherry);
    border-color: var(--black-cherry-light);
    color: white;
    transform: translateY(-2px);
    box-shadow: var(--shadow-cherry);
}

.pagination-btn:disabled {
    opacity: 0.25;
    cursor: not-allowed;
}

.pagination-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
}

.page-current {
    color: var(--black-cherry-glow);
    font-weight: 700;
    font-size: 1.1rem;
}

.page-separator {
    color: var(--text-dim);
}

.page-total {
    color: var(--text-main);
    font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 100px 30px;
  background: var(--glass);
  border-radius: var(--radius-2xl);
  border: 2px dashed var(--glass-border);
  margin-top: 40px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: var(--text-main);
  font-size: 1.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.empty-state p {
  color: var(--text-muted);
  margin-bottom: 30px;
}

.create-btn-empty {
  background: linear-gradient(135deg, var(--black-cherry) 0%, var(--black-cherry-vibrant) 100%);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  font-family: 'Outfit', sans-serif;
  box-shadow: var(--shadow-cherry);
  letter-spacing: 0.5px;
}

.create-btn-empty:hover {
  background: linear-gradient(135deg, var(--black-cherry-vibrant) 0%, var(--black-cherry-glow) 100%);
  transform: translateY(-3px);
  box-shadow: var(--shadow-cherry-lg);
}
</style>

<style src="../../assets/styles/vehicles.css"></style>
