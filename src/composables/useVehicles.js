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

    const fetchVehicles = async () => {
        loading.value = true;
        try {
            const data = await vehicleService.getAll();
            vehicles.value = data.map(v => ({
                ...v,
                image: v.image_url ? `http://127.0.0.1:8000${v.image_url}` : 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800'
            }));
        } catch (err) {
            console.error("Error al cargar vehículos:", err);
            error.value = "No se pudieron cargar los vehículos";
        } finally {
            loading.value = false;
        }
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

            if (response && response.vehicle) {
                const newVehicle = response.vehicle;
                vehicles.value.push({
                    ...newVehicle,
                    image: newVehicle.image_url ? `http://127.0.0.1:8000${newVehicle.image_url}` : 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800'
                });
            }

            return true;
        } catch (err) {
            console.error("Error completo:", err);
            error.value = err.response?.data?.message || "Error al crear el vehículo";
            return false;
        } finally {
            loading.value = false;
        }
    }

    const handleUpdateVehicle = async () => {
        if (!selectedVehicleId.value) return false;
        loading.value = true;
        error.value = null;
        try {
            const data = {
                brand: form.brand,
                model: form.model,
                year: form.year,
                price: form.price,
                status: form.status
            };

            await vehicleService.update({ ...data, _id: selectedVehicleId.value });

            // Actualizar localmente
            const index = vehicles.value.findIndex(v => (v._id || v.id) === selectedVehicleId.value);
            if (index !== -1) {
                vehicles.value[index] = { ...vehicles.value[index], ...data };
            }

            return true;
        } catch (err) {
            console.error("Error al actualizar:", err);
            error.value = "No se pudo actualizar el vehículo";
            return false;
        } finally {
            loading.value = false;
        }
    };

    const handleDeleteVehicle = async (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este vehículo?')) return;
        loading.value = true;
        try {
            await vehicleService.delete(id);
            vehicles.value = vehicles.value.filter(v => (v._id || v.id) !== id);
            return true;
        } catch (err) {
            console.error("Error al eliminar:", err);
            error.value = "No se pudo eliminar el vehículo";
            return false;
        } finally {
            loading.value = false;
        }
    }

    return {
        openModal,
        closeModal,
        isModalOpen,
        isEditMode,
        selectedVehicleId,
        vehicles,
        loading,
        error,
        form,
        fetchVehicles,
        handleCreateVehicle,
        handleUpdateVehicle,
        handleDeleteVehicle,
        resetForm
    };
}
