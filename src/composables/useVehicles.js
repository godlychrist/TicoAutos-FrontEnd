import { ref, reactive, computed } from 'vue';
import vehicleService from '@/services/vehicleService';
import { useRouter } from 'vue-router';

// Composable: Gestiona el estado y la lógica de los Vehículos
const isModalOpen = ref(false);
const vehicles = ref([]);
const loading = ref(false);
const error = ref(null);

// Estado del formulario de creación/edición de vehículos
const form = reactive({
    id: null,
    model: '',
    brand: '',
    year: '2024',
    price: '',
    status: 'available',
    image: null
});

// Configuración de la paginación de la API
const pagination = reactive({
    total: 0,
    per_page: 8,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: 8
});

// Filtros de búsqueda aplicables al catálogo
const filters = reactive({
    search: '',
    brand: '',
    status: '',
    year_min: '',
    year_max: '',
    price_range: ''
});

export function useVehicles() {

    // Limpia los datos del formulario
    const resetForm = () => {
        form.id = null;
        form.model = '';
        form.brand = '';
        form.year = '2024';
        form.price = '';
        form.status = 'available';
        form.image = null;
    };

    // Limpia los filtros asignados en el catálogo
    const resetFilters = () => {
        filters.search = '';
        filters.brand = '';
        filters.status = '';
        filters.year_min = '';
        filters.year_max = '';
        filters.price_range = '';
    }

    // Abre el modal para crear o editar (si recibe objeto) un vehículo
    const openModal = (vehicle = null) => {
        if (vehicle) {
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

    const closeModal = () => {
        isModalOpen.value = false;
        resetForm();
    };

    // Manda la solicitud POST para registrar un nuevo auto
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

            // Adjunta el ID del usuario actual que lo crea
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

    // Carga la lista de vehículos consultando la API según pagina y filtros
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

    // Retorna la URL completa de una imagen
    const imageUrl = (image) => {
        if (!image) return '';
        if (image.startsWith('http')) return image;
        return `http://127.0.0.1:8000/storage/${image}`;
    }

    // Actualiza los datos de un vehículo (PUT con FormData Spoofing)
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

            formData.append('_method', 'PUT'); // Truco para Laravel

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

    // Elimina un vehículo por completo del sistema
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

    // Cambia únicamente el estatus publico/privado del auto
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

    // Carga la data completa de un solo vehículo por su ID
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

    // Obtiene una lista única de marcas registradas para los filtros
    const brands = computed(() => {
        const allBrands = vehicles.value.map(v => v.brand);
        return [...new Set(allBrands)];
    });

    // --- UTILIDADES GLOBALES DE LA PLATAFORMA ---
    const router = useRouter();

    const currentUserData = computed(() => {
        return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    });

    const currentUserId = computed(() => {
        return currentUserData.value ? (currentUserData.value._id || currentUserData.value.id || currentUserData.value.ID) : null;
    });

    const isAuthenticated = computed(() => !!localStorage.getItem('token'));

    const currentUserName = computed(() => {
        return currentUserData.value ? (currentUserData.value.username || currentUserData.value.name) : 'Usuario';
    });

    // Validar si el usuario navegando es el dueño real del vehículo
    const checkIsOwner = (vehicleUserId) => {
        return Boolean(currentUserId.value && vehicleUserId && String(currentUserId.value) === String(vehicleUserId));
    };

    const formatPrice = (price, useCurrency = false) => {
        if (useCurrency) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
        }
        return new Intl.NumberFormat('en-US').format(price);
    };

    const showCopiedMessage = ref(false);

    // Permite copiar la URL para compartir un vehículo
    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url).then(() => {
            showCopiedMessage.value = true;
            setTimeout(() => { showCopiedMessage.value = false; }, 2000);
        });
    };

    // Validar si hay usuario activo antes de intentar mandar un mensaje
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