<template>
  <div class="vehicles-page">
    <nav class="top-nav">
      <div class="logo">TICO<span>AUTOS</span></div>
      <div class="user-info">
        <span class="username" v-if="user">{{ user.username }}</span>
        <button @click="handleLogout" class="logout-btn">Salir</button>
      </div>
    </nav>

    <main class="content">
      <header class="page-header">
        <div class="title-section">
          <span class="subtitle">Nuestra Flota</span>
          <h1 class="main-title">Vehículos Exclusivos</h1>
        </div>
        
        <div class="filters">
          <button class="filter-btn active">Todos</button>
          <button class="filter-btn">Sedan</button>
          <button class="filter-btn">SUV</button>
          <button class="filter-btn">Sport</button>
        </div>
      </header>

      <div v-if="isLoading" class="loading-state">
        <div class="loader"></div>
        <p>Cargando flota premium...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchVehicles" class="retry-btn">Reintentar</button>
      </div>

      <div v-else class="vehicles-grid">
        <vehicleCard 
          v-for="(vehicle, index) in vehicles" 
          :key="vehicle.id" 
          :vehicle="vehicle"
          :index="index"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import vehicleCard from './vehicleCard.vue';
import { useVehicles } from '../composables/useVehicles';

const { vehicles, isLoading, error, fetchVehicles } = useVehicles();
const user = ref(null);

onMounted(() => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    user.value = JSON.parse(savedUser);
  }
});

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload(); // Simple navigation reset
};
</script>

<style scoped>
.vehicles-page {
  min-height: 100vh;
  background-color: #050505;
  color: white;
  padding-bottom: 50px;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 2px;
}

.logo span {
  color: #dc2626;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.username {
  font-weight: 600;
  color: #eee;
  font-size: 0.9rem;
}

.logout-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: white;
  color: black;
}

.content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 50px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 50px;
}

.subtitle {
  color: #dc2626;
  text-transform: uppercase;
  letter-spacing: 4px;
  font-weight: 700;
  font-size: 0.8rem;
  display: block;
  margin-bottom: 10px;
}

.main-title {
  font-size: 3rem;
  font-weight: 800;
}

.filters {
  display: flex;
  gap: 10px;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  padding: 10px 25px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.filter-btn.active, .filter-btn:hover {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
}

.vehicles-grid {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #dc2626;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 30px;
  }
  
  .main-title {
    font-size: 2rem;
  }
}
</style>
