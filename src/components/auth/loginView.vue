<template>
  <div class="auth-page">
    <div class="glow red-glow"></div>
    <div class="glow dark-glow"></div>
    <div class="mesh-background"></div>

    <div class="container">
      <div class="auth-wrapper" :class="{ 'is-register': !isLogin }">
        
        <!-- Brand Side -->
        <authBrandSide />

        <!-- Form Side -->
        <div class="form-side">
          <div class="form-content">
            
            <div class="header-text">
              <h2>{{ isLogin ? 'Bienvenido' : 'Crear Cuenta' }}</h2>
              <p>{{ isLogin ? 'Inicia sesión para continuar con tu viaje.' : 'Únete a la flota más exclusiva.' }}</p>
            </div>

            <form @submit.prevent="handleFormSubmit" class="auth-form">
              <authInput 
                id="username"
                v-model="username"
                label="Usuario"
                required
              />

              <authInput 
                id="password"
                v-model="password"
                type="password"
                label="Contraseña"
                required
              />

              <!-- Solo para Registro -->
              <authInput 
                v-if="!isLogin"
                id="confirmPassword"
                type="password"
                label="Confirmar Contraseña"
                required
              />

              <div class="helper-links" v-if="isLogin">
                <label class="custom-checkbox">
                  <input type="checkbox">
                  <span class="checkmark"></span>
                  <span class="label-text">Recordarme</span>
                </label>
                <a href="#" class="link red">¿Olvidaste tu contraseña?</a>
              </div>

              <div v-if="loginError" class="login-error">
                {{ loginError }}
              </div>

              <button type="submit" class="submit-btn" :disabled="isLoading">
                <span class="btn-text">
                  {{ isLoading ? 'PROCESANDO...' : (isLogin ? 'INICIAR SESIÓN' : 'REGISTRARME') }}
                </span>
              </button>
            </form>

            <div class="footer-links">
              <p v-if="isLogin">
                ¿No tienes una cuenta? 
                <a href="#" @click.prevent="isLogin = false" class="link red">Únete a la flota</a>
              </p>
              <p v-else>
                ¿Ya eres parte de TicoAutos? 
                <a href="#" @click.prevent="isLogin = true" class="link red">Inicia Sesión</a>
              </p>
            </div>
            
            <socialLogins />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import authBrandSide from './authBrandSide.vue';
import authInput from './authInput.vue';
import socialLogins from './socialLogins.vue';
import authService from '@/assets/services/authService';

const isLogin = ref(true);
const username = ref('');
const password = ref('');
const isLoading = ref(false);
const loginError = ref(null);

const emit = defineEmits(['login']);

const handleFormSubmit = async () => {
    isLoading.value = true;
    loginError.value = null;
    try {
        if (isLogin.value) {
            const response = await authService.login({
                username: username.value,
                password: password.value
            });
            // Emitimos los datos reales que vienen del servidor (incluyendo el _id)
            emit('login', response.data.user || response.data);
        } else {
            // Lógica de registro...
            await authService.register({
                username: username.value,
                password: password.value
                // Otros campos si son necesarios
            });
            isLogin.value = true;
            isLoading.value = false;
        }
    } catch (error) {
        console.error('Error en autenticación:', error);
        loginError.value = error.response?.data?.message || 'Error al conectar con el servidor';
    } finally {
        isLoading.value = false;
    }
};
</script>

<style src="../../assets/styles/auth.css"></style>

<style scoped>
.login-error {
    color: #dc2626;
    background: rgba(220, 38, 38, 0.1);
    padding: 10px;
    border-radius: 8px;
    font-size: 0.85rem;
    margin-bottom: 15px;
    border: 1px solid rgba(220, 38, 38, 0.2);
    text-align: center;
}
</style>
