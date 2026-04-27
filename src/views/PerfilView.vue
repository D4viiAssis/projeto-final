<script setup>
import { onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import Spinner from '@/components/ui/Spinner.vue';

const route = useRoute();
const profileStore = useProfileStore();
const authStore = useAuthStore();

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

onMounted(loadProfile);
watch(() => route.query.user, loadProfile);

const handleFollow = async () => {
  await profileStore.toggleFollow(profileStore.user.id);
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
          <div class="avatar-container mx-auto">
            <img 
              :src="profileStore.user.avatar_url || 'https://ui-avatars.com/api/?name=' + profileStore.user.name" 
              class="rounded-circle img-thumbnail"
              style="width: 150px; height: 150px; object-fit: cover;"
            />
          </div>
        </div>
        
        <div class="col-8 text-start">
          <div class="d-flex align-items-center gap-3 mb-3">
            <h2 class="h4 mb-0">{{ profileStore.user.username }}</h2>
            <router-link v-if="isOwnProfile" to="/perfil/editar" class="btn btn-sm btn-outline-dark fw-bold text-decoration-none">
              Editar Perfil
            </router-link>
            <button v-else @click="handleFollow" class="btn btn-sm fw-bold" :class="profileStore.user.is_following ? 'btn-outline-secondary' : 'btn-primary'">
              {{ profileStore.user.is_following ? 'Seguindo' : 'Seguir' }}
            </button>
          </div>

          <div class="d-flex gap-4 mb-3">
            <span><strong>{{ profileStore.posts.length }}</strong> publicações</span>
            <span><strong>{{ profileStore.user.followers_count || 0 }}</strong> seguidores</span>
            <span><strong>{{ profileStore.user.following_count || 0 }}</strong> seguindo</span>
          </div>

          <p class="fw-bold mb-0 text-start">{{ profileStore.user.name }}</p>
          <p class="text-muted text-start">{{ profileStore.user.bio || 'Bio do InstaClone 🚀' }}</p>
        </div>
      </header>

      <div class="row g-2">
        <div v-for="post in profileStore.posts" :key="post.id" class="col-4">
          <router-link :to="`/posts/${post.id}`" class="d-block ratio ratio-1x1 border">
            <img :src="post.image_url" class="object-fit-cover" alt="Post" />
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
.object-fit-cover { object-fit: cover; width: 100%; height: 100%; }
</style>