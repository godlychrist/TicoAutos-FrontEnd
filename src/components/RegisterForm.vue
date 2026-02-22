<template>
  <div class="register-container">
    <h2>Registro de Usuario</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label>Nombre:</label>
        <input v-model="name" type="text" required />
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>
      <div class="form-group">
        <label>Contraseña:</label>
        <input v-model="password" type="password" required />
      </div>
      <div class="form-group">
        <label>Confirmar Contraseña:</label>
        <input v-model="password_confirmation" type="password" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Registrando...' : 'Registrarse' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      loading: false,
      error: null
    };
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/register', {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation
        });
        
        alert('¡Registro exitoso! Ya puedes iniciar sesión.');
        console.log('User registered:', response.data);
      } catch (err) {
        if (err.response && err.response.data) {
          // Si Laravel devuelve errores de validación, los mostramos
          const errors = err.response.data;
          this.error = Object.values(errors).flat().join(' ');
        } else {
          this.error = 'Error en el registro. Verifica los datos.';
        }
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #35495e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background-color: #949fb1;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
