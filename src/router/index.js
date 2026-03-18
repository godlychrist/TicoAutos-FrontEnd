/**
 * router/index.js - Configuración de Vue Router.
 *
 * Define las rutas de la aplicación y un guard de navegación global
 * que protege las rutas privadas (mensajes) redirigiendo al login
 * si no existe un token JWT válido en localStorage.
 *
 * Rutas públicas: login, vehicles (catálogo), vehicle-detail.
 * Rutas protegidas: messages (requieren autenticación).
 */
import { createRouter, createWebHistory } from 'vue-router';
import loginView from '../components/auth/loginView.vue';
import vehicleListView from '../components/vehicles/vehicleListView.vue';
import vehicleDetailView from '../components/vehicles/vehicleDetailView.vue';
import messagesView from '../components/messages/messagesView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: loginView
        },
        {
            path: '/vehicles',
            name: 'vehicles',
            component: vehicleListView
        },
        {
            path: '/vehicles/:id',
            name: 'vehicle-detail',
            component: vehicleDetailView
        },
        {
            path: '/messages',
            name: 'messages',
            component: messagesView
        }
    ]
})

// Guard global: verifica autenticación antes de acceder a rutas protegidas
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    const publicPages = ['login', 'vehicles', 'vehicle-detail'];
    const authRequired = !publicPages.includes(to.name);

    if (authRequired && !token) {
        next({ name: 'login' });
    } else {
        next();
    }
})

export default router;

