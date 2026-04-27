<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import Avatar from '@/components/ui/Avatar.vue';
import Spinner from '@/components/ui/Spinner.vue';

const users = ref([]);
const isLoading = ref(true);
const error = ref(null);

const fetchSuggestions = async () => {
  isLoading.value = true;
  try {
    const { data } = await api.get('/users/suggestions');
    users.value = data.data || data;
  } catch (err) {
    error.value = "Não foi possível carregar sugestões.";
  } finally {
    isLoading.value = false;
  }
};

const toggleFollow = async (user) => {
  const originalState = user.is_following;
  // Muda na tela instantaneamente (Otimista)
  user.is_following = !user.is_following;

  try {
    if (user.is_following) {
      await api.post(`/users/${user.id}/follow`);
    } else {
      await api.delete(`/users/${user.id}/follow`);
    }
    // Opcional: Se quiser ter certeza absoluta após o clique
    // const res = await api.get(`/users/${user.id}/is-following`);
    // user.is_following = res.data.is_following;
  } catch (err) {
    user.is_following = originalState;
    alert("Erro ao processar.");
  }
};

onMounted(fetchSuggestions);
</script>

<template>
  <div class="descobrir-container mx-auto py-4 px-3" style="max-width: 600px;">
    <h5 class="fw-bold mb-4 text-start">Sugestões para você</h5>

    <div v-if="isLoading" class="text-center mt-5">
      <Spinner size="md" />
    </div>

    <div v-else-if="error" class="alert alert-warning text-start small">{{ error }}</div>

    <div v-else class="suggestions-list bg-white border rounded shadow-sm">
      <div 
        v-for="user in users" 
        :key="user.id" 
        class="user-item d-flex align-items-center justify-content-between p-3 border-bottom"
      >
        <router-link 
          :to="`/perfil?user=${user.username}`" 
          class="d-flex align-items-center text-decoration-none text-dark"
        >
          <Avatar size="md" :src="user.avatar_url" :alt="user.username" />
          <div class="ms-3 text-start">
            <p class="mb-0 fw-bold lh-1 small">{{ user.username }}</p>
            <p class="mb-0 text-muted small">{{ user.name }}</p>
          </div>
        </router-link>

        <button 
          @click="toggleFollow(user)"
          class="btn btn-sm px-3 fw-bold"
          :class="user.is_following ? 'btn-light border text-dark' : 'btn-primary'"
        >
          {{ user.is_following ? 'Seguindo' : 'Seguir' }}
        </button>
      </div>

      <div v-if="users.length === 0" class="p-5 text-center text-muted">
        Nenhuma sugestão disponível.
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-item:last-child { border-bottom: none !important; }
.btn-primary { background-color: #0095f6; border: none; }
.btn-light { background-color: #efefef; }
</style>