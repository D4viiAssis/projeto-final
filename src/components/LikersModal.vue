<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import Spinner from '@/components/ui/Spinner.vue';

const props = defineProps({
  postId: { type: [Number, String], required: true }
});

const emit = defineEmits(['close']);

const users = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const { data } = await api.get(`/posts/${props.postId}/likes`);
    users.value = data.data || data;
  } catch (error) {
    console.error("Erro ao carregar curtidas:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content border-0 shadow-lg">
      <div class="modal-header border-bottom py-2 px-3 d-flex justify-content-between align-items-center">
        <div style="width: 32px;"></div> <h6 class="mb-0 fw-bold">Curtidas</h6>
        <button type="button" class="btn-close shadow-none" @click="emit('close')" aria-label="Close"></button>
      </div>
      <div class="modal-body p-0 overflow-auto" style="max-height: 400px; min-height: 250px;">
        <div v-if="isLoading" class="text-center py-5">
          <Spinner size="sm" color="primary" />
          <p class="text-muted small mt-2">Carregando...</p>
        </div>
        <div v-else-if="users.length > 0">
          <div v-for="user in users" :key="user.id" class="d-flex align-items-center p-3">
            <router-link :to="`/perfil?user=${user.username}`" @click="emit('close')">
              <img 
                :src="user.avatar_url || 'https://ui-avatars.com/api/?name=' + user.name" 
                class="rounded-circle border me-3" 
                style="width: 44px; height: 44px; object-fit: cover;"
              />
            </router-link>
            <div class="text-start flex-grow-1">
              <router-link :to="`/perfil?user=${user.username}`" @click="emit('close')" class="text-decoration-none text-dark d-block">
                <span class="fw-bold d-block small lh-1">{{ user.username }}</span>
                <span class="text-muted small">{{ user.name }}</span>
              </router-link>
            </div>
            <button class="btn btn-sm btn-outline-secondary fw-bold px-3 py-1" style="font-size: 0.75rem;">
              Seguir
            </button>
          </div>
        </div>
        <div v-else class="text-center py-5">
          <div class="rounded-circle border border-2 d-inline-flex p-3 mb-2">
            <i class="bi bi-heart h3 mb-0 text-muted"></i>
          </div>
          <p class="text-muted small">Ninguém curtiu ainda.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
  animation: modalIn 0.2s ease-out;
}

@keyframes modalIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-body::-webkit-scrollbar {
  width: 5px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #dbdbdb;
  border-radius: 10px;
}

.text-start {
  text-align: left !important;
}
</style>