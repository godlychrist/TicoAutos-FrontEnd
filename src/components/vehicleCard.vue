<template>
  <div class="vehicle-card" :style="{ '--delay': index * 0.1 + 's' }">
    <div class="card-image-wrapper">
      <img :src="vehicle.image" :alt="vehicle.name" class="vehicle-image" />
      <div class="badge">{{ vehicle.category }}</div>
      <div class="overlay">
        <button class="view-details-btn">Ver Detalles</button>
      </div>
    </div>
    
    <div class="card-info">
      <div class="header">
        <div class="brand-info">
          <img v-if="vehicle.brand.toLowerCase().includes('ferrari')" src="../assets/ferrari-logo.png" alt="Ferrari" class="card-brand-logo">
          <span class="brand">{{ vehicle.brand }}</span>
        </div>
        <h3 class="name">{{ vehicle.name }}</h3>
      </div>
      
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Velocidad</span>
          <span class="stat-value">{{ vehicle.stats.speed }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Autonomía</span>
          <span class="stat-value">{{ vehicle.stats.range }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Potencia</span>
          <span class="stat-value">{{ vehicle.stats.power }}</span>
        </div>
      </div>
      
      <div class="card-footer">
        <div class="price-box">
          <span class="price-label">Desde</span>
          <span class="price">${{ vehicle.price }}</span>
        </div>
        <button class="book-btn">RESERVAR</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
  vehicle: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
});
</script>

<style scoped>
.vehicle-card {
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  animation: slideUp 0.6s ease forwards;
  animation-delay: var(--delay);
  opacity: 0;
  transform: translateY(30px);
  display: flex;
  flex-direction: row; /* Horizontal layout */
  height: 280px;
}

@media (max-width: 768px) {
  .vehicle-card {
    flex-direction: column;
    height: auto;
  }
}

.vehicle-card:hover {
  transform: translateX(10px); /* Slide right instead of up */
  border-color: rgba(220, 38, 38, 0.3);
  box-shadow: 20px 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(220, 38, 38, 0.1);
}

.card-image-wrapper {
  position: relative;
  width: 40%;
  flex-shrink: 0;
  overflow: hidden;
}

@media (max-width: 768px) {
  .card-image-wrapper {
    width: 100%;
    height: 200px;
  }
}

.vehicle-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.vehicle-card:hover .vehicle-image {
  transform: scale(1.1);
}

.card-info {
  padding: 30px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.card-brand-logo {
  height: 20px;
  width: auto;
}

.brand {
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.name {
  color: white;
  font-size: 1.75rem;
  margin: 5px 0 15px 0;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.stats-grid {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  color: #666;
  font-size: 0.7rem;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.stat-value {
  color: #eee;
  font-size: 1rem;
  font-weight: 700;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-box {
  display: flex;
  flex-direction: column;
}

.price-label {
  color: #666;
  font-size: 0.7rem;
}

.price {
  color: white;
  font-size: 1.6rem;
  font-weight: 800;
}

.book-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.book-btn:hover {
  background: #b91c1c;
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
  transform: scale(1.05);
}

.badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  z-index: 2;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.4), transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.vehicle-card:hover .overlay {
  opacity: 1;
}

.view-details-btn {
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.view-details-btn:hover {
  background: white;
  color: black;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
