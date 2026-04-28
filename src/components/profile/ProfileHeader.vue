<template>
  <div class="profile-header text-center mb-4">
    <Avatar :src="user.avatar_url" :alt="user.username" size="xl" class="mb-3" />
    <h5 class="fw-bold">{{ user.username }}</h5>
    <p class="text-muted">{{ user.name }}</p>
    <p v-if="user.bio" class="mb-3">{{ user.bio }}</p>
    <div class="d-flex justify-content-center gap-3 mb-3">
      <div>
        <strong>{{ postsCount }}</strong> posts
      </div>
      <div>
        <strong>{{ followersCount }}</strong> seguidores
      </div>
      <div>
        <strong>{{ followingCount }}</strong> seguindo
      </div>
    </div>
    <button
      v-if="isOwnProfile"
      @click="$router.push({ name: 'EDIT_PROFILE' })"
      class="btn btn-outline-primary"
    >
      Editar perfil
    </button>
    <button
      v-else
      @click="toggleFollow"
      class="btn"
      :class="isFollowing ? 'btn-light border' : 'btn-primary'"
    >
      {{ isFollowing ? 'Seguindo' : 'Seguir' }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useFollowsStore } from '@/stores/follows';
import Avatar from '@/components/ui/Avatar.vue';
import { ROUTE_NAMES } from '@/router/routeNames';

const props = defineProps({
  user: { type: Object, required: true },
  postsCount: { type: Number, default: 0 },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 }
});

const authStore = useAuthStore();
const followsStore = useFollowsStore();

const isOwnProfile = computed(() => props.user.id === authStore.user?.id);
const isFollowing = computed(() => followsStore.isFollowing(props.user.id));

const toggleFollow = async () => {
  await followsStore.toggleFollow(props.user.id);
};
</script>