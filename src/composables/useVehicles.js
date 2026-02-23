import { ref, reactive } from 'vue';
import vehicleService from '@/services/vehicleService';

const isModalOpen = ref(false);
const vehicles = ref([]);
const loading = ref(false);
const error = ref(null);

// 1. EL ID TIENE QUE EXISTIR AQUÍ DESDE EL PRINCIPIO
const form = reactive({
    id: null,
    model: '',
    brand: '',
    year: '2024',
    price: '',
    status: 'available',
    image: null
});

export function useVehicles() {

    const resetForm = () => {
        form.id = null; // 2. LIMPIAR EL ID AQUÍ TAMBIÉN
        form.model = '';
        form.brand = '';
        form.year = '2024';
        form.price = '';
        form.status = 'available';
        form.image = null;
    };

    const openModal = (vehicle = null) => {
        // DEBUG: Esto nos dirá qué está llegando cuando le das al botón Editar
        console.log("VEHÍCULO RECIBIDO EN OPEN MODAL:", vehicle);

        if (vehicle) {
            // 3. CAPTURAR EL ID (Cubrimos todas las opciones posibles)
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

            if (form.image) {
                formData.append('image', form.image);
            }

            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                const userId = user._id || user.id || user.ID;
                if (userId) {
                    formData.append('user_id', userId);
                }
            }

            const response = await vehicleService.create(formData);

            if (response.data && response.data.vehicle) {
                vehicles.value.push(response.data.vehicle);
            }

            return true;
        } catch (err) {
            error.value = err.response?.data?.message || "Error al crear el vehículo";
            console.error(err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    const getVehicles = async () => {
        loading.value = true;
        error.value = null;
        try {
            const data = await vehicleService.getAll();
            vehicles.value = data;
        } catch (err) {
            error.value = "Error al cargar los vehículos";
            vehicles.value = [];
            console.error(err);
        } finally {
            loading.value = false;
        }
    }

    const imageUrl = (image) => {
        if (!image) return '';
        if (image.startsWith('http')) return image;
        return `http://127.0.0.1:8000/storage/${image}`;
    }

    const updateVehicle = async (id) => {
        loading.value = true;
        try {
            const formData = new FormData();
            formData.append('brand', form.brand);
            formData.append('model', form.model);
            formData.append('year', form.year);
            formData.append('price', form.price);
            formData.append('status', form.status);

            // 1. Agregamos el user_id (ESTO ERA LO QUE FALTABA)
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                const userId = user._id || user.id || user.ID;
                if (userId) {
                    formData.append('user_id', userId);
                }
            }

            // TRUCO PARA LARAVEL (Spoofing)
            formData.append('_method', 'PUT');

            if (form.image && typeof form.image !== 'string') {
                formData.append('image', form.image);
            }

            const response = await vehicleService.update(id, formData);

            const updatedVehicle = response.vehicle ?? response;
            const idx = vehicles.value.findIndex(v => (v.id || v._id) === id);
            if (idx !== -1) {
                vehicles.value[idx] = updatedVehicle;
            }
            return true;
        } catch (err) {
            console.error("Error al editar:", err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    const handleDeleteVehicle = async (id) => {
        loading.value = true;
        try {
            await vehicleService.remove(id);
            const idx = vehicles.value.findIndex(v => (v.id || v._id) === id);
            if (idx !== -1) {
                vehicles.value.splice(idx, 1);
            }
            return true;
        } catch (err) {
            console.error("Error al eliminar:", err);
            return false;
        } finally {
            loading.value = false;
        }
    };

    return {
        isModalOpen,
        vehicles,
        loading,
        error,
        form,
        openModal,
        closeModal,
        handleCreateVehicle,
        getVehicles,
        imageUrl,
        updateVehicle,
        handleDeleteVehicle
    };
}