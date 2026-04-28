<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useFollowsStore } from '@/stores/follows';
import { ROUTE_NAMES } from '@/router/routeNames';
import Spinner from '@/components/ui/Spinner.vue';
import Avatar from '@/components/ui/Avatar.vue'; // Se não tiver o AccountCard pronto, usamos a base

const followsStore = useFollowsStore();
const users = ref([]);
const isLoading = ref(true);
const error = ref(null);

const fetchSuggestions = async () => {
  isLoading.value = true;
  try {
    const { data } = await api.get('/users/suggestions');
    users.value = (data.data || data).filter(u => !followsStore.isFollowing(u.id));
  } catch (err) {
    error.value = "Não foi possível carregar sugestões.";
  } finally {
    isLoading.value = false;
  }
};

const handleToggleFollow = async (user) => {
  await followsStore.toggleFollow(user.id);
  // Especificação: Após seguir em sugestões, removemos da lista local
  users.value = users.value.filter(u => u.id !== user.id);
};

onMounted(fetchSuggestions);
</script>

<template>
  <div class="container py-4" style="max-width: 600px;">
    <h5 class="fw-bold mb-4">Sugestões para você</h5>

    <div v-if="isLoading" class="text-center py-5">
      <Spinner size="md" />
    </div>

    <div v-else-if="error" class="alert alert-warning">{{ error }}</div>

    <div v-else class="list-group shadow-sm">
      <div 
        v-for="user in users" 
        :key="user.id" 
        class="list-group-item d-flex align-items-center justify-content-between p-3"
      >
        <router-link 
          :to="{ name: ROUTE_NAMES.PROFILE, query: { user: user.username } }" 
          class="d-flex align-items-center text-decoration-none text-dark"
        >
          <Avatar size="md" :src="user.avatar_url" :alt="user.username" />
          <div class="ms-3">
            <p class="mb-0 fw-bold small">{{ user.username }}</p>
            <p class="mb-0 text-muted small">{{ user.name }}</p>
          </div>
        </router-link>

        <button 
          @click="handleToggleFollow(user)"
          class="btn btn-sm fw-bold px-3"
          :class="followsStore.isFollowing(user.id) ? 'btn-light border' : 'btn-primary'"
        >
          {{ followsStore.isFollowing(user.id) ? 'Seguindo' : 'Seguir' }}
        </button>
      </div>

      <div v-if="users.length === 0" class="p-5 text-center text-muted">
        Nenhuma sugestão no momento.
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-primary { background-color: #0095f6; border: none; }
.btn-light { background-color: #efefef; }
</style>