<template>
  <div id="app">
    <component :is="currentView" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import loginView from './components/loginView.vue';
import vehicleListView from './components/vehicleListView.vue';

const isAuthenticated = ref(false);

onMounted(() => {
  isAuthenticated.value = !!localStorage.getItem('token');
});

const currentView = computed(() => {
  return isAuthenticated.value ? vehicleListView : loginView;
});
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap');

body {
  margin: 0;
  padding: 0;
  background-color: #050505;
  font-family: 'Montserrat', sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'Montserrat', sans-serif;
}
</style>