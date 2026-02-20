<template>
  <div>
    <h1>Respuesta del Back: {{ mensaje }}</h1>
    <button @click="conectar">Probar Conexión</button>
  </div>
</template>

<script>
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