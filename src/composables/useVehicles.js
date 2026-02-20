import { ref, onMounted } from 'vue';
import vehicleService from '../assets/services/vehicleService.js';

export function useVehicles() {
    const vehicles = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    const fetchVehicles = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const data = await vehicleService.getAll();
            vehicles.value = data;
        } catch (err) {
            error.value = err.message || 'Error al cargar los vehículos';
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        fetchVehicles();
    });

    return {
        vehicles,
        isLoading,
        error,
        fetchVehicles
    };
}
