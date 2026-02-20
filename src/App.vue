<template>
<<<<<<< HEAD
  <div id="app">
    <h1>TicoAutos</h1>
    <div class="auth-box">
      <button @click="currentView = 'login'">Ir a Login</button>
      <button @click="currentView = 'register'">Ir a Registro</button>
    </div>
    
    <LoginForm v-if="currentView === 'login'" />
    <RegisterForm v-if="currentView === 'register'" />
=======
  <div>
    <h1>Respuesta del Back: {{ mensaje }}</h1>
    <button @click="conectar">Probar Conexión</button>
>>>>>>> 5f4a8a209de49c72125a03533562fee2b5a4ca7d
  </div>
</template>

<script>
<<<<<<< HEAD
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
=======
import axios from 'axios';

export default {
  data() {
    return {
      mensaje: 'Esperando...'
    }
  },
  methods: {
    async conectar() {
      try {
        // Asegúrate de usar el puerto que te dio php artisan serve
        const res = await axios.get('http://127.0.0.1:8000/api/saludo');
        this.mensaje = res.data.mensaje;
      } catch (error) {
        this.mensaje = "Error: " + error.message;
      }
    }
  }
}
</script>
>>>>>>> 5f4a8a209de49c72125a03533562fee2b5a4ca7d
