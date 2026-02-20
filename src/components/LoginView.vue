<template>
  <div class="auth-page">
    <div class="glow red-glow"></div>
    <div class="glow dark-glow"></div>
    <div class="mesh-background"></div>

    <div class="container">
      <div class="auth-wrapper" :class="{ 'is-register': !isLogin }">
        
        <!-- Brand Side -->
        <div class="brand-side">
          <div class="brand-content">
            <h1 class="premium-title">TICO<span>AUTOS</span></h1>
            <p class="premium-subtitle">EXCLUSIVIDAD EN CADA KILÓMETRO</p>
            <div class="decorative-line"></div>
          </div>
        </div>

        <!-- Form Side -->
        <div class="form-side">
          <div class="form-content">
            
            <div class="header-text">
              <h2>{{ isLogin ? 'Bienvenido' : 'Crear Cuenta' }}</h2>
              <p>{{ isLogin ? 'Inicia sesión para continuar con tu viaje.' : 'Únete a la flota más exclusiva.' }}</p>
            </div>

            <form @submit.prevent="handleSubmit" class="auth-form">
              <!-- Común para ambos -->
              <div class="input-field">
                <input 
                  type="text" 
                  id="username" 
                  v-model="form.username" 
                  required 
                  placeholder=" "
                />
                <label for="username">Usuario</label>
                <div class="underline"></div>
              </div>

              <div class="input-field">
                <input 
                  type="password" 
                  id="password" 
                  v-model="form.password" 
                  required 
                  placeholder=" "
                />
                <label for="password">Contraseña</label>
                <div class="underline"></div>
              </div>

              <!-- Solo para Registro -->
              <div class="input-field animate-in" v-if="!isLogin">
                <input 
                  type="password" 
                  id="confirmPassword" 
                  v-model="form.confirmPassword" 
                  required 
                  placeholder=" "
                />
                <label for="confirmPassword">Confirmar Contraseña</label>
                <div class="underline"></div>
              </div>

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
                <a href="#" @click.prevent="isLogin = false" class="link red">Únete a la flota</a>
              </p>
              <p v-else>
                ¿Ya eres parte de TicoAutos? 
                <a href="#" @click.prevent="isLogin = true" class="link red">Inicia Sesión</a>
              </p>
            </div>
            
            <div class="divider">
              <span>O continúa con</span>
            </div>

            <div class="social-grid">
              <button class="social-item">
                <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
              </button>
              <button class="social-item">
                <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12,2C6.477,2,2,6.477,2,12c0,5.089,3.912,9.22,8.938,9.914V14.89h-2.54V12h2.54V9.797c0-2.506,1.492-3.89,3.777-3.89c1.094,0,2.238,0.195,2.238,0.195v2.46h-1.26c-1.243,0-1.63,0.771-1.63,1.562V12h2.773l-0.443,2.89h-2.33v7.024C18.088,21.22,22,17.089,22,12C22,6.477,17.523,2,12,2z"/></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthView',
  data() {
    return {
      isLogin: true,
      isLoading: false,
      form: {
        username: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
      }
    }
  },
  methods: {
    handleSubmit() {
      if (!this.isLogin && this.form.password !== this.form.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        const msg = this.isLogin ? 'Acceso concedido a TicoAutos' : 'Cuenta creada con éxito';
        alert(msg);
      }, 1500);
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;800&family=Syncopate:wght@400;700&display=swap');

.auth-page {
  min-height: 100vh;
  background-color: #050505;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  position: relative;
  overflow: hidden;
  color: #eee;
}

/* Background Effects */
.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  z-index: 1;
}

.red-glow {
  top: -10%;
  right: -5%;
  width: 500px;
  height: 500px;
  background: rgba(255, 0, 43, 0.12);
  animation: pulse 8s infinite alternate;
}

.dark-glow {
  bottom: -10%;
  left: -5%;
  width: 600px;
  height: 600px;
  background: rgba(255, 0, 43, 0.04);
}

@keyframes pulse {
  from { transform: scale(1); opacity: 0.4; }
  to { transform: scale(1.15); opacity: 0.7; }
}

.mesh-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 0, 43, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 0, 43, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  z-index: 1;
  mask-image: radial-gradient(circle at center, black, transparent 90%);
}

.container {
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  z-index: 10;
}

.auth-wrapper {
  display: flex;
  background: rgba(5, 5, 5, 0.8);
  backdrop-filter: blur(30px);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 0, 43, 0.15);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.9);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.brand-side {
  flex: 1;
  background: linear-gradient(135deg, #0a0a0a 0%, #000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  overflow: hidden;
  border-right: 1px solid rgba(255, 0, 43, 0.1);
}

.brand-side::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top right, rgba(255, 0, 43, 0.15), transparent 70%);
}

.brand-content {
  position: relative;
  z-index: 2;
  text-align: left;
}

.premium-title {
  font-family: 'Syncopate', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -2px;
  margin: 0;
  line-height: 1;
  color: #fff;
}

.premium-title span {
  color: #ff002b;
  display: block;
}

.premium-subtitle {
  font-size: 0.7rem;
  letter-spacing: 6px;
  color: #555;
  margin-top: 15px;
  font-weight: 400;
}

.decorative-line {
  width: 50px;
  height: 3px;
  background: #ff002b;
  margin-top: 30px;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 0, 43, 0.5);
}

.form-side {
  flex: 1.2;
  padding: 60px;
  background: #080808;
}

.form-content {
  max-width: 380px;
  margin: 0 auto;
}

.header-text h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #fff;
}

.header-text p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 40px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.input-field {
  position: relative;
  width: 100%;
}

.animate-in {
  animation: slideDown 0.4s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.input-field input {
  width: 100%;
  padding: 12px 0;
  font-size: 0.95rem;
  color: #fff;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 0, 43, 0.2);
  outline: none;
  transition: all 0.3s ease;
}

.input-field label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 12px 0;
  color: #444;
  pointer-events: none;
  transition: all 0.3s ease;
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 2px;
  background: #ff002b;
  transition: all 0.4s ease;
  box-shadow: 0 0 8px rgba(255, 0, 43, 0.4);
}

.input-field input:focus ~ label,
.input-field input:not(:placeholder-shown) ~ label {
  top: -20px;
  font-size: 0.75rem;
  color: #ff002b;
}

.input-field input:focus ~ .underline {
  width: 100%;
}

.helper-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  color: #555;
}

.custom-checkbox input {
  display: none;
}

.checkmark {
  width: 16px;
  height: 16px;
  border: 1px solid rgba(255, 0, 43, 0.3);
  border-radius: 4px;
  margin-right: 10px;
  display: inline-block;
  position: relative;
  background: #000;
}

.custom-checkbox input:checked + .checkmark {
  background: #ff002b;
  border-color: #ff002b;
}

.custom-checkbox input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-size: 10px;
  font-weight: 900;
}

.link {
  text-decoration: none;
  transition: 0.3s;
}

.link.red { 
  color: #ff002b; 
  font-weight: 600;
}

.link:hover { opacity: 0.8; }

.submit-btn {
  margin-top: 10px;
  padding: 18px;
  border: none;
  border-radius: 12px;
  background: #111;
  color: #fff;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 2.5px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 1;
  border: 1px solid rgba(255, 0, 43, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  background: #ff002b;
  border-color: #ff002b;
  box-shadow: 0 10px 20px rgba(255, 0, 43, 0.3);
}

.loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s infinite linear;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.footer-links {
  text-align: center;
  margin-top: 35px;
  font-size: 0.85rem;
  color: #444;
}

.divider {
  margin: 30px 0;
  position: relative;
  text-align: center;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background: rgba(255, 0, 43, 0.1);
}

.divider span {
  position: relative;
  background: #080808;
  padding: 0 15px;
  color: #333;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.social-grid {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.social-item {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  background: #000;
  border: 1px solid rgba(255, 0, 43, 0.15);
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-item:hover {
  background: rgba(255, 0, 43, 0.1);
  border-color: #ff002b;
  color: #ff002b;
  transform: translateY(-3px);
}

@media (max-width: 900px) {
  .brand-side { display: none; }
  .auth-wrapper { max-width: 450px; margin: 0 auto; }
}

@media (max-width: 500px) {
  .auth-wrapper {
    border-radius: 0;
    border: none;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }
  .form-side { padding: 30px 20px; }
}
</style>
