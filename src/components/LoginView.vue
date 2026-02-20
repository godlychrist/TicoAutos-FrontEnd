<script setup>
import { useAuth } from '../composables/useAuth';
import authBrandSide from './authBrandSide.vue';
import authInput from './authInput.vue';
import socialLogins from './socialLogins.vue';

const { form, isLogin, isLoading, error, toggleAuthMode, handleSubmit } = useAuth();

const handleSocialLogin = (platform) => {
  alert(`Click en ${platform}`);
};
</script>

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

            <!-- Mensaje de Error -->
            <div v-if="error" class="error-banner">
              {{ error }}
            </div>

            <form @submit.prevent="handleSubmit" class="auth-form">
              <authInput 
                id="username"
                v-model="form.username"
                label="Usuario"
                required
              />

              <authInput 
                id="password"
                type="password"
                v-model="form.password"
                label="Contraseña"
                required
              />

              <!-- Solo para Registro -->
              <authInput 
                v-if="!isLogin"
                id="confirmPassword"
                type="password"
                v-model="form.confirmPassword"
                label="Confirmar Contraseña"
                required
                animate
              />

              <div class="helper-links" v-if="isLogin">
                <label class="custom-checkbox">
                  <input type="checkbox" v-model="form.rememberMe">
                  <span class="checkmark"></span>
                  <span class="label-text">Recordarme</span>
                </label>
                <a href="#" class="link red">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" class="submit-btn" :disabled="isLoading">
                <span class="btn-text" v-if="!isLoading">
                  {{ isLogin ? 'INICIAR SESIÓN' : 'REGISTRARME' }}
                </span>
                <div class="loader" v-else></div>
              </button>
            </form>

            <div class="footer-links">
              <p v-if="isLogin">
                ¿No tienes una cuenta? 
                <a href="#" @click.prevent="toggleAuthMode" class="link red">Únete a la flota</a>
              </p>
              <p v-else>
                ¿Ya eres parte de TicoAutos? 
                <a href="#" @click.prevent="toggleAuthMode" class="link red">Inicia Sesión</a>
              </p>
            </div>
            
            <socialLogins @social-click="handleSocialLogin" />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>


<style scoped>
@import "../assets/styles/auth.css";

.error-banner {
  background: rgba(220, 38, 38, 0.1);
  border-left: 4px solid #dc2626;
  color: #dc2626;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 4px;
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>
