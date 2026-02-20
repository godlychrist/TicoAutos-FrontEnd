<template>
  <div id="app">
    <h1>TicoAutos</h1>
    <div class="auth-box">
      <button @click="currentView = 'login'">Ir a Login</button>
      <button @click="currentView = 'register'">Ir a Registro</button>
    </div>
    
    <LoginForm v-if="currentView === 'login'" />
    <RegisterForm v-if="currentView === 'register'" />

    <!-- Sección de prueba de Cris (Merge) -->
    <div class="debug-section" v-if="mensaje">
      <hr>
      <h3>Prueba de Conexión (Cris):</h3>
      <p>Respuesta del Back: {{ mensaje }}</p>
      <button @click="conectar">Probar Conexión</button>
    </div>
  </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    LoginForm,
    RegisterForm
  },
  data() {
    return {
      currentView: 'login',
      mensaje: ''
    }
  },
  methods: {
    async conectar() {
      try {
        const response = await axios.get('http://localhost:8000/api/user')
        this.mensaje = JSON.stringify(response.data)
      } catch (error) {
        this.mensaje = 'Error al conectar: ' + error.message
      }
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
.debug-section {
  margin-top: 50px;
  padding: 20px;
  background-color: #f9f9f9;
}
</style>
