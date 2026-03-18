/**
 * useVehicles.js - Composable principal de vehículos (Vue 3 Composition API).
 *
 * Centraliza TODO el estado y lógica de vehículos de la aplicación:
 * - Estado global compartido (vehicles, form, pagination, filters)
 * - CRUD completo (crear, editar, eliminar, cambiar estado)
 * - Filtros de búsqueda y paginación
 * - Utilidades globales: usuario autenticado, formateo de precios,
 *   verificación de propiedad, clipboard, y navegación condicional.
 *
 * Los refs/reactives definidos FUERA de la función son singleton (estado global).
 * Los definidos DENTRO se re-crean por componente que lo use.
 */
import { ref, reactive, computed } from 'vue';
import vehicleService from '@/services/vehicleService';
import { useRouter } from 'vue-router';

// ── Estado global (singleton compartido entre todos los componentes) ──
const isModalOpen = ref(false);
const vehicles = ref([]);
const loading = ref(false);
const error = ref(null);

// Formulario reactivo para crear/editar vehículos
const form = reactive({
    id: null,
    model: '',
    brand: '',
    year: '2024',
    price: '',
    status: 'available',
    image: null
});

// Estado de paginación (sincronizado con Laravel paginate)
const pagination = reactive({
    total: 0,
    per_page: 8,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: 8
});

// Filtros de búsqueda (se envían como query params al backend)
const filters = reactive({
    search: '',
    brand: '',
    status: '',
    year_min: '',
    year_max: '',
    price_range: ''
});

export function useVehicles() {

    /** Resetear el formulario a valores por defecto */
    const resetForm = () => {
        form.id = null;
        form.model = '';
        form.brand = '';
        form.year = '2024';
        form.price = '';
        form.status = 'available';
        form.image = null;
    };

    /** Limpiar todos los filtros de búsqueda */
    const resetFilters = () => {
        filters.search = '';
        filters.brand = '';
        filters.status = '';
        filters.year_min = '';
        filters.year_max = '';
        filters.price_range = '';
    }

    /**
     * Abrir el modal de creación/edición.
     * Si recibe un vehículo, pre-carga sus datos en el form (modo edición).
     * Si no recibe nada, resetea el form (modo creación).
     */
    const openModal = (vehicle = null) => {
        console.log("VEHÍCULO RECIBIDO EN OPEN MODAL:", vehicle);

        if (vehicle) {
            // Capturar el ID (cubre _id de MongoDB, id de cast, etc.)
            form.id = vehicle.id || vehicle._id || vehicle.ID;
            form.model = vehicle.model;
            form.brand = vehicle.brand;
            form.year = vehicle.year;
            form.price = vehicle.price;
            form.status = vehicle.status;
            form.image = vehicle.image;
        } else {
            resetForm();
        }
        isModalOpen.value = true;
    };

    /** Cerrar el modal y limpiar el formulario */
    const closeModal = () => {
        isModalOpen.value = false;
        resetForm();
    };

    /**
     * Crear un nuevo vehículo.
     * Construye un FormData con todos los campos + imagen + user_id del localStorage.
     * Refresca la lista automáticamente al completarse.
     */
    const handleCreateVehicle = async () => {
        loading.value = true;
        error.value = null;
        try {
            const formData = new FormData();
            formData.append('brand', form.brand);
            formData.append('model', form.model);
            formData.append('year', form.year);
            formData.append('price', form.price);
            formData.append('status', form.status);

            if (form.image) formData.append('image', form.image);

            // Adjuntar user_id desde la sesión almacenada
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                const userId = user._id || user.id || user.ID;
                if (userId) formData.append('user_id', userId);
            }

            await vehicleService.create(formData);
            await getVehicles(); // Recargar data
            return true;
        } catch (err) {
            error.value = err.response?.data?.message || "Error al crear el vehículo";
            return false;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Obtener lista de vehículos con filtros y paginación.
     * Sincroniza el estado de paginación con la respuesta de Laravel.
     */
    const getVehicles = async (page = 1) => {
        loading.value = true;
        error.value = null;
        try {
            const data = await vehicleService.getAll(filters, page);
            pagination.current_page = data.current_page;
            pagination.total = data.total;
            pagination.last_page = data.last_page;
            vehicles.value = data.data;
        } catch (err) {
            error.value = "Error al cargar los vehículos";
            vehicles.value = [];
        } finally {
            loading.value = false;
        }
    }

    /** Generar URL completa de la imagen (local storage de Laravel o URL externa) */
    const imageUrl = (image) => {
        if (!image) return '';
        if (image.startsWith('http')) return image;
        return `http://127.0.0.1:8000/storage/${image}`;
    }

    /**
     * Actualizar un vehículo existente.
     * Usa FormData + method spoofing (_method: PUT) para compatibilidad con Laravel.
     * Solo adjunta la imagen si es un archivo nuevo (no string de ruta existente).
     */
    const updateVehicle = async (id) => {
        loading.value = true;
        try {
            const formData = new FormData();
            formData.append('brand', form.brand);
            formData.append('model', form.model);
            formData.append('year', form.year);
            formData.append('price', form.price);
            formData.append('status', form.status);

            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                const userId = user._id || user.id || user.ID;
                if (userId) formData.append('user_id', userId);
            }

            // Method spoofing: Laravel interpreta POST + _method=PUT como PUT real
            formData.append('_method', 'PUT');

            if (form.image && typeof form.image !== 'string') {
                formData.append('image', form.image);
            }

            await vehicleService.update(id, formData);
            await getVehicles();
            return true;
        } catch (err) {
            return false;
        } finally {
            loading.value = false;
        }
    };

    /** Eliminar un vehículo y refrescar la lista */
    const handleDeleteVehicle = async (id) => {
        loading.value = true;
        try {
            await vehicleService.remove(id);
            await getVehicles();
            return true;
        } catch (err) {
            return false;
        } finally {
            loading.value = false;
        }
    };

    /** Cambiar el estado de un vehículo (available ↔ sold) */
    const updateVehicleStatus = async (id, newStatus) => {
        loading.value = true;
        try {
            await vehicleService.update(id, { status: newStatus });
            await getVehicles();
            return true;
        } catch (err) {
            return false;
        } finally {
            loading.value = false;
        }
    };

    /** Obtener un vehículo individual por ID (para la vista de detalle) */
    const getVehicleById = async (id) => {
        loading.value = true;
        try {
            return await vehicleService.getById(id);
        } catch (err) {
            error.value = "Error al cargar el vehículo";
            return null;
        } finally {
            loading.value = false;
        }
    };

    /** Lista única de marcas (computed desde los vehículos cargados en memoria) */
    const brands = computed(() => {
        const allBrands = vehicles.value.map(v => v.brand);
        return [...new Set(allBrands)];
    });

    // ── Utilidades globales del usuario ──
    const router = useRouter();

    /** Datos del usuario autenticado desde localStorage */
    const currentUserData = computed(() => {
        return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    });

    /** ID del usuario actual (soporta _id, id, ID de MongoDB) */
    const currentUserId = computed(() => {
        return currentUserData.value ? (currentUserData.value._id || currentUserData.value.id || currentUserData.value.ID) : null;
    });

    /** Flag reactivo: ¿el usuario tiene sesión activa? */
    const isAuthenticated = computed(() => !!localStorage.getItem('token'));

    /** Nombre del usuario para mostrar en la UI */
    const currentUserName = computed(() => {
        return currentUserData.value ? (currentUserData.value.username || currentUserData.value.name) : 'Usuario';
    });

    /** Verificar si el usuario actual es el dueño de un vehículo dado */
    const checkIsOwner = (vehicleUserId) => {
        return Boolean(currentUserId.value && vehicleUserId && String(currentUserId.value) === String(vehicleUserId));
    };

    /** Formatear precio con locale US (opcionalmente con símbolo de moneda) */
    const formatPrice = (price, useCurrency = false) => {
        if (useCurrency) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
        }
        return new Intl.NumberFormat('en-US').format(price);
    };

    const showCopiedMessage = ref(false);

    /** Copiar URL al portapapeles con feedback visual temporal */
    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url).then(() => {
            showCopiedMessage.value = true;
            setTimeout(() => { showCopiedMessage.value = false; }, 2000);
        });
    };

    /** Redirigir a mensajes si está autenticado, o al login si no lo está */
    const requireLoginForMessages = () => {
        if (!isAuthenticated.value) {
            alert("Debes iniciar sesión para hacer preguntas al vendedor.");
            router.push('/login');
            return false;
        }
        router.push('/messages');
        return true;
    };

    return {
        isModalOpen, vehicles, loading, error, form, filters, brands, pagination,
        isAuthenticated, currentUserName, showCopiedMessage,
        openModal, closeModal, handleCreateVehicle, getVehicles, imageUrl,
        updateVehicle, handleDeleteVehicle, updateVehicleStatus, getVehicleById,
        resetFilters, checkIsOwner, formatPrice, copyToClipboard, requireLoginForMessages
    };
}