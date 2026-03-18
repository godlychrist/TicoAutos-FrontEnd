/**
 * useAuth.js - Composable de autenticación (Vue 3 Composition API).
 *
 * Gestiona el estado reactivo del formulario de login/registro,
 * el flujo de autenticación (toggle entre modos), almacenamiento
 * del token JWT en localStorage, y la navegación post-login.
 */
import { ref, reactive } from 'vue';
import authService from '@/services/authServices.js';
import router from '@/router';

export function useAuth() {
    const error = ref(null);
    const isLoading = ref(false);
    const isLogin = ref(true);

    // Estado reactivo del formulario (compartido entre login y registro)
    const form = reactive({
        username: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
    });

    /** Alternar entre modo Login y modo Registro */
    const toggleAuthMode = () => {
        isLogin.value = !isLogin.value;
    };

    /**
     * Procesar el formulario según el modo actual.
     * - Login: obtiene token JWT y lo almacena en localStorage, redirige a /vehicles.
     * - Registro: valida contraseña mínima, registra al usuario, y cambia a modo login.
     */
    const handleSubmit = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            if (isLogin.value) {
                const response = await authService.login(form);
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    localStorage.setItem('userId', response.user.id);
                    router.push('/vehicles');
                }

            } else {
                if (form.password.length < 6) {
                    error.value = "La contraseña debe tener al menos 6 dígitos";
                    isLoading.value = false;
                    return;
                }

                await authService.register({
                    username: form.username,
                    password: form.password,
                    password_confirmation: form.confirmPassword
                });
                alert("¡Registrado!");
                isLogin.value = true;
                form.username = '';
                form.password = '';
                form.confirmPassword = '';
            }
        } catch (err) {
            // Extraer mensaje de error del backend (prioriza 'error' sobre 'message')
            if (err.response && err.response.data && err.response.data.error) {
                error.value = err.response.data.error;
            } else if (err.response && err.response.data && err.response.data.message) {
                error.value = err.response.data.message;
            } else {
                error.value = "Credenciales incorrectas o error de conexión";
            }

            form.password = '';
        } finally {
            isLoading.value = false;
        }
    };

    /** Cerrar sesión: limpiar localStorage y redirigir al login */
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    }
    return { form, isLogin, isLoading, error, toggleAuthMode, handleSubmit, handleLogout };
}

