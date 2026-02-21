<template>
  <div id="app">
    <loginView v-if="!isLoggedIn" @login="handleLogin" />
    <vehicleListView v-else :username="currentUser.username" @logout="handleLogout" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import loginView from './components/auth/loginView.vue';
import vehicleListView from './components/vehicles/vehicleListView.vue';

const isLoggedIn = ref(false);
const currentUser = ref({ username: '' });

const handleLogin = (userData) => {
  currentUser.value.username = userData.username;
  isLoggedIn.value = true;
  // Guardamos el objeto completo del usuario que viene del backend
  localStorage.setItem('user', JSON.stringify(userData));
};

const handleLogout = () => {
  isLoggedIn.value = false;
  currentUser.value.username = '';
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