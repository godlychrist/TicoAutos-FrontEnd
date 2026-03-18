/**
 * main.js - Punto de entrada de la aplicación Vue 3.
 *
 * Inicializa la instancia de Vue, registra el router,
 * y monta la aplicación en el elemento #app del DOM.
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')