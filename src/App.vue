<template>
  <div id="app">
    <loginView v-if="!isLoggedIn" @login="handleLogin" />
    <vehicleListView v-else :username="currentUser.username" @logout="handleLogout" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import loginView from './components/auth/loginView.vue';
import vehicleListView from './components/vehicles/vehicleListView.vue';

const isLoggedIn = ref(false);
const currentUser = ref({ username: '' });

// Verificar si hay sesión guardada al cargar la aplicación
onMounted(() => {
  const savedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  if (savedUser && token) {
    try {
      currentUser.value = JSON.parse(savedUser);
      isLoggedIn.value = true;
    } catch (e) {
      console.error("Error al restaurar sesión:", e);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
});

const handleLogin = (userData) => {
  currentUser.value = userData;
  isLoggedIn.value = true;
  // Los datos ya se guardan en el localStorage dentro de loginView.vue
};

const handleLogout = () => {
  isLoggedIn.value = false;
  currentUser.value = { username: '' };
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap');

body {
  margin: 0;
  padding: 0;
  background-color: #050505;
  font-family: 'Montserrat', sans-serif;
  color: white;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>