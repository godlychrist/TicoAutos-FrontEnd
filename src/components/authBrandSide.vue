<template>
  <div class="brand-side">
    <div class="brand-content">
      <img src="../assets/ferrari-logo.png" alt="Ferrari Logo" class="brand-logo">
      <h1 class="premium-title">TICO<span>AUTOS</span></h1>
      <p class="premium-subtitle">EXCLUSIVIDAD EN CADA KILÓMETRO</p>
      <div class="decorative-line"></div>
    </div>
  </div>
</template>

<style scoped>
.brand-logo {
  width: 150px;
  height: auto;
  margin-bottom: 24px;
  filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.4));
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.brand-logo:hover {
  transform: scale(1.05) rotate(2deg);
}
</style>

<script>
export default {
  name: 'authBrandSide'
}
</script>
