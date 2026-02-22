import { ref, reactive } from 'vue';
import vehicleService from '@/assets/services/vehicleService';

const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedVehicleId = ref(null);
const vehicles = ref([]);
const loading = ref(false);
const error = ref(null);

const form = reactive({
    model: '',
    brand: '',
    year: '2024',
    price: '',
    status: 'available',
    image: null
});
export function useVehicles() {

    const resetForm = () => {
        form.model = '';
        form.brand = '';
        form.year = '2024';
        form.price = '';
        form.status = 'available';
        form.image = null;
        isEditMode.value = false;
        selectedVehicleId.value = null;
    };

    const openModal = (vehicle = null) => {
        if (vehicle) {
            isEditMode.value = true;
            selectedVehicleId.value = vehicle._id || vehicle.id;
            form.model = vehicle.model;
            form.brand = vehicle.brand;
            form.year = vehicle.year;
            form.price = vehicle.price;
            form.status = vehicle.status;
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
            const data = await vehicleService.getAll();
            vehicles.value = data;
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
            error.value = err.message || 'Error al cargar los vehículos';
            error.value = err.response?.data?.message || "Error al crear el vehículo";
            console.error(err);
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
        handleCreateVehicle
    };

}




