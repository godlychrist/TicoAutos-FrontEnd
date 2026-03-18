import { ref, reactive } from 'vue';
import authService from '@/services/authServices.js';
import router from '@/router';

// Composable: Gestiona el estado y la lógica de Autenticación
export function useAuth() {
    const error = ref(null);
    const isLoading = ref(false);
    const isLogin = ref(true); // Alterna entre login y registro

    // Datos del formulario de autenticación
    const form = reactive({
        username: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
    });

    const toggleAuthMode = () => {
        isLogin.value = !isLogin.value;
    };

    // Procesa el envío del formulario (Login o Registro)
    const handleSubmit = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            if (isLogin.value) {
                // Iniciar sesión
                const response = await authService.login(form);
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    localStorage.setItem('userId', response.user.id);
                    router.push('/vehicles'); // Redirigir al catálogo
                }
            } else {
                // Validación básica de registro
                if (form.password.length < 6) {
                    error.value = "La contraseña debe tener al menos 6 dígitos";
                    isLoading.value = false;
                    return;
                }

                // Registrar nuevo usuario
                await authService.register({
                    username: form.username,
                    password: form.password,
                    password_confirmation: form.confirmPassword
                });
                alert("¡Registrado!");
                isLogin.value = true;
                
                // Limpiar formulario tras registro exitoso
                form.username = '';
                form.password = '';
                form.confirmPassword = '';
            }
        } catch (err) {
            // Manejo de errores devueltos por la API
            if (err.response && err.response.data && err.response.data.error) {
                error.value = err.response.data.error;
            } else if (err.response && err.response.data && err.response.data.message) {
                error.value = err.response.data.message;
            } else {
                error.value = "Credenciales incorrectas o error de conexión";
            }
            form.password = ''; // Limpiar password por seguridad
        } finally {
            isLoading.value = false;
        }
    };

    // Cierra la sesión activa
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return { form, isLogin, isLoading, error, toggleAuthMode, handleSubmit, handleLogout };
}
