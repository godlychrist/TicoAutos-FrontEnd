import { ref, reactive } from 'vue';
import authService from '../assets/services/authService.js';

export function useAuth() {
    const error = ref(null);
    const isLoading = ref(false);
    const isLogin = ref(true);

    const form = reactive({
        username: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
    });

    const toggleAuthMode = () => {
        isLogin.value = !isLogin.value;
    };

    const handleSubmit = async () => {
        isLoading.value = true;
        try {
            if (isLogin.value) {
                const response = await authService.login(form);
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }

            } else {
                await authService.register({
                    username: form.username,
                    password: form.password,
                    password_confirmation: form.confirmPassword
                });
                alert("¡Registrado!");
                isLogin.value = true;
            }
        } catch (err) {
            error.value = "Error en la operación";
        } finally {
            isLoading.value = false;
        }
    };
    return { form, isLogin, isLoading, error, toggleAuthMode, handleSubmit };
}
