import { createRouter, createWebHistory } from 'vue-router';
import loginView from '../components/auth/loginView.vue';
import vehicleListView from '../components/vehicles/vehicleListView.vue';
import vehicleDetailView from '../components/vehicles/vehicleDetailView.vue';
import messagesView from '../components/messages/messagesView.vue';

// Configuración de rutas (Vue Router)
const router = createRouter({
    history: createWebHistory(), // Historial HTML5 limpio
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
});

// Guardián de navegación: Protege rutas que requieren autenticación
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    
    const publicPages = ['login', 'vehicles', 'vehicle-detail']; // Rutas permitidas sin login
    const authRequired = !publicPages.includes(to.name);

    if (authRequired && !token) {
        next({ name: 'login' }); // Redirigir al login si no hay token
    } else {
        next(); // Permitir acceso
    }
});

export default router;
