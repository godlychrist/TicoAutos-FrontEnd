<template>
  <div id="app">
    <h1>TicoAutos</h1>
    <div class="auth-box">
      <button @click="currentView = 'login'">Ir a Login</button>
      <button @click="currentView = 'register'">Ir a Registro</button>
    </div>
    
    <LoginForm v-if="currentView === 'login'" />
    <RegisterForm v-if="currentView === 'register'" />
  </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'

export default {
  name: 'App',
  components: {
    LoginForm,
    RegisterForm
  },
  data() {
    return {
      currentView: 'login'
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
}
.auth-box {
  margin-bottom: 20px;
}
button {
  margin: 0 10px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>