<template>
  <div class="vehicle-card" :style="{ '--delay': index * 0.1 + 's' }">
    <div class="card-image-wrapper">
      <img 
        v-if="vehicle.image" 
        :src="imageUrl(vehicle.image)" 
        :alt="vehicle.model"
        class="vehicle-image"
      />
      <div :class="['badge', vehicle.status]">{{ vehicle.status === 'available' ? 'Disponible' : 'Vendido' }}</div>
      
      <!-- Botones de Acción Profesionales -->
      <div class="card-actions-overlay">
        <!-- Compartir (Para todos - Requisito UTN) -->
        <div class="share-wrapper">
          <transition name="fade">
            <span v-if="showCopiedMessage" class="copied-tooltip">¡Copiado!</span>
          </transition>
          <button class="action-btn share" @click.stop="handleShare" title="Copiar enlace público">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          </button>
        </div>

        <!-- Editar y Borrar (Solo dueño) -->
        <template v-if="isOwner">
          <button class="action-btn edit" @click.stop="handleEdit" title="Editar Vehículo">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="action-btn delete" @click.stop="handleDelete(vehicle._id || vehicle.id)" title="Eliminar Vehículo">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </template>
      </div>
      

      <div class="overlay">
        <button class="view-details-btn" @click="goToDetail">Ver Detalles</button>
      </div>
    </div>
    
    <div class="card-info">
      <div class="header">
        <div class="brand-info">
          <span class="brand">{{ vehicle.brand }}</span>
        </div>
        <h3 class="name">{{ vehicle.model }}</h3>
      </div>
      
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Año</span>
          <span class="stat-value">{{ vehicle.year }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Estado</span>
          <span class="stat-value">{{ vehicle.status === 'available' ? 'Disponible' : 'Vendido' }}</span>
        </div>
      </div>
      
      <div class="card-footer">
        <div class="price-box">
          <span class="price-label">Precio</span>
          <span class="price">${{ formatPrice(vehicle.price) }}</span>
        </div>
        
        <!-- Si es el DUEÑO: Botón para cambiar estado -->
        <button 
          v-if="isOwner" 
          @click.stop="handleStatusToggle"
          :class="['book-btn', 'toggle-btn', vehicle.status]"
        >
          {{ vehicle.status === 'available' ? 'MARCAR VENDIDO' : 'A DISPONIBLE' }}
        </button>

        <!-- Si NO es el dueño: Botón de preguntar (Requisito UTN) -->
        <button 
          v-else 
          class="book-btn ask"
          @click.stop="$router.push('/messages')"
        >
          PREGUNTAR
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useVehicles } from '@/composables/useVehicles';

const router = useRouter();

const props = defineProps({
  vehicle: Object,
  index: Number
});

const { handleDeleteVehicle, openModal, imageUrl, updateVehicleStatus } = useVehicles();

const handleStatusToggle = async () => {
  const newStatus = props.vehicle.status === 'available' ? 'sold' : 'available';
  const vehicleId = props.vehicle._id || props.vehicle.id;
  await updateVehicleStatus(vehicleId, newStatus);
};

// Obtener el usuario actual para verificar propiedad
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
const currentUserId = currentUser._id || currentUser.id || currentUser.ID;

const isOwner = computed(() => {
  const vehicleUserId = props.vehicle.user_id || props.vehicle.userId;
  return currentUserId && vehicleUserId && String(currentUserId) === String(vehicleUserId);
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US').format(price);
};

const handleDelete = async (id) => {
  // 1. Agregamos una alerta de confirmación nativa
  const isConfirmed = window.confirm(`¿Estás seguro de que deseas eliminar el ${props.vehicle.brand} ${props.vehicle.model}?`);
  
  if (isConfirmed) {
    // 2. Si dice que sí, llamamos a la función de tu composable
    const success = await handleDeleteVehicle(id);
    
    if (success) {
      console.log('Vehículo eliminado exitosamente');
    } else {
      alert('Hubo un problema al eliminar el vehículo.');
    }
  }
};

const handleEdit = () => {
  // Ahora abre el modal con los datos del vehículo
  openModal(props.vehicle);
};

const showCopiedMessage = ref(false);

const handleShare = () => {
  const vehicleId = props.vehicle._id || props.vehicle.id;
  const shareUrl = `${window.location.origin}/vehicles/${vehicleId}`;
  
  navigator.clipboard.writeText(shareUrl).then(() => {
    showCopiedMessage.value = true;
    setTimeout(() => {
      showCopiedMessage.value = false;
    }, 2000);
  }).catch(err => {
    console.error('Error al copiar:', err);
  });
};

const goToDetail = () => {
  const id = props.vehicle._id || props.vehicle.id;
  router.push(`/vehicles/${id}`);
};
</script>

<style scoped>
.card-actions-overlay {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.vehicle-card:hover .card-actions-overlay {
  opacity: 1;
  transform: translateX(0);
}

.action-btn {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  backdrop-filter: blur(12px);
  color: white;
  background: rgba(0, 0, 0, 0.4);
}

.action-btn.share {
  background: rgba(255, 255, 255, 0.1);
}

.share-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.copied-tooltip {
  position: absolute;
  right: 45px;
  background: var(--black-cherry);
  color: white;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: var(--shadow-cherry);
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.action-btn:hover {
  transform: scale(1.1);
  background: var(--black-cherry);
  border-color: var(--black-cherry-light);
}

.action-btn.delete:hover {
  background: var(--error);
  border-color: var(--error);
}

.badge.available {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.3);
  color: var(--success);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.15);
}

.badge.sold {
  background: rgba(74, 13, 43, 0.8);
  border-color: var(--black-cherry-light);
  box-shadow: 0 4px 15px rgba(74, 13, 43, 0.25);
}

.book-btn.ask {
  background: white;
  color: var(--bg-main);
  border: none;
  font-weight: 700;
}

.book-btn.ask:hover {
  background: var(--text-secondary);
  transform: scale(1.05);
}

.book-btn.toggle-btn.available {
  background: linear-gradient(135deg, var(--black-cherry), var(--black-cherry-vibrant));
  color: white;
  border-color: var(--black-cherry-light);
  box-shadow: var(--shadow-cherry);
}

.book-btn.toggle-btn.sold {
  background: var(--success);
  color: white;
  border-color: rgba(16, 185, 129, 0.5);
}
</style>
