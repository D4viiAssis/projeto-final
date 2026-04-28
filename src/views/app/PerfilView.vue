<script setup>
import { onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import { useFollowsStore } from '@/stores/follows';
import { ROUTE_NAMES, CONNECTION_LIST_TYPES } from '@/router/routeNames';
import Spinner from '@/components/ui/Spinner.vue';

const route = useRoute();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const followsStore = useFollowsStore();

const isOwnProfile = computed(() => {
  const usernameQuery = route.query.user;
  return !usernameQuery || usernameQuery === authStore.user?.username;
});

const loadProfile = async () => {
  const username = route.query.user;
  if (isOwnProfile.value) {
    await profileStore.fetchMyProfile();
  } else {
    await profileStore.fetchUserProfile(username);
  }
};

// Sincroniza a lista de quem eu sigo para o botão estar sempre correto
onMounted(async () => {
  await loadProfile();
  if (authStore.user?.id) {
    await followsStore.fetchFollowingList(authStore.user.id);
  }
});

watch(() => route.query.user, loadProfile);

const handleFollowAction = async () => {
  const userId = profileStore.user.id;
  await followsStore.toggleFollow(userId);
  
  // Atualiza o contador de seguidores na tela localmente (UX)
  if (followsStore.isFollowing(userId)) {
    profileStore.user.followers_count++;
  } else {
    profileStore.user.followers_count--;
  }
};
</script>

<template>
  <div class="container py-4" style="max-width: 935px;">
    <div v-if="profileStore.isLoading" class="text-center py-5">
      <Spinner size="lg" />
    </div>

    <div v-else-if="profileStore.user">
      <header class="row mb-5 pb-4 border-bottom align-items-center">
        <div class="col-4 text-center">
          <img 
            :src="profileStore.user.avatar_url || 'https://ui-avatars.com/api/?name=' + profileStore.user.name" 
            class="rounded-circle img-thumbnail"
            style="width: 150px; height: 150px; object-fit: cover;"
          />
        </div>
        
        <div class="col-8 text-start">
          <div class="d-flex align-items-center gap-3 mb-3">
            <h2 class="h4 mb-0">{{ profileStore.user.username }}</h2>
            
            <router-link 
              v-if="isOwnProfile" 
              :to="{ name: ROUTE_NAMES.EDIT_PROFILE }" 
              class="btn btn-sm btn-outline-dark fw-bold"
            >
              Editar Perfil
            </router-link>

            <button 
              v-else 
              @click="handleFollowAction" 
              class="btn btn-sm fw-bold" 
              :class="followsStore.isFollowing(profileStore.user.id) ? 'btn-outline-secondary' : 'btn-primary'"
            >
              {{ followsStore.isFollowing(profileStore.user.id) ? 'Seguindo' : 'Seguir' }}
            </button>
          </div>

          <div class="d-flex gap-4 mb-3">
            <span><strong>{{ profileStore.posts.length }}</strong> publicações</span>
            
            <router-link 
              :to="{ name: ROUTE_NAMES.PROFILE_CONNECTIONS, params: { type: CONNECTION_LIST_TYPES.FOLLOWERS }, query: route.query }"
              class="text-decoration-none text-dark"
            >
              <strong>{{ profileStore.user.followers_count || 0 }}</strong> seguidores
            </router-link>

            <router-link 
              :to="{ name: ROUTE_NAMES.PROFILE_CONNECTIONS, params: { type: CONNECTION_LIST_TYPES.FOLLOWING }, query: route.query }"
              class="text-decoration-none text-dark"
            >
              <strong>{{ profileStore.user.following_count || 0 }}</strong> seguindo
            </router-link>
          </div>

          <p class="fw-bold mb-0">{{ profileStore.user.name }}</p>
          <p class="text-muted">{{ profileStore.user.bio || 'Bio do InstaClone 🚀' }}</p>
        </div>
      </header>

      <div class="row g-2">
        <div v-for="post in profileStore.posts" :key="post.id" class="col-4">
          <router-link :to="{ name: ROUTE_NAMES.POST_DETAILS, params: { postId: post.id } }" class="d-block ratio ratio-1x1 border">
            <img :src="post.image_url" class="object-fit-cover w-100 h-100" style="object-fit: cover;" />
          </router-link>
        </div>
        <div v-if="profileStore.posts.length === 0" class="text-center py-5 text-muted">
          <i class="bi bi-camera h1 d-block"></i> Ainda não há publicações.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-primary { background-color: #0095f6; border: none; }
</style>