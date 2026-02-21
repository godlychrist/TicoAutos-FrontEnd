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
          <span class="brand">{{ vehicle.brand }}</span>
        </div>
        <h3 class="name">{{ vehicle.name }}</h3>
      </div>
      
      <div class="stats-grid">
        <div class="stat-item" v-for="(val, label) in vehicle.stats" :key="label">
          <span class="stat-label">{{ label }}</span>
          <span class="stat-value">{{ val }}</span>
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
defineProps({
  vehicle: Object,
  index: Number
});
</script>
