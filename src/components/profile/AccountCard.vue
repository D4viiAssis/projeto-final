<template>
  <div class="account-card d-flex align-items-center justify-content-between p-3 border-bottom">
    <router-link :to="profileLink" class="d-flex align-items-center text-decoration-none text-dark flex-grow-1">
      <Avatar :src="user.avatar_url" :alt="user.username" size="md" />
      <div class="ms-3">
        <p class="mb-0 fw-bold">{{ user.username }}</p>
        <p class="mb-0 text-muted small">{{ user.name }}</p>
      </div>
    </router-link>
    <button
      v-if="showFollowButton"
      @click="$emit('toggleFollow', user.id)"
      class="btn btn-sm"
      :class="isFollowing ? 'btn-light border' : 'btn-primary'"
    >
      {{ isFollowing ? 'Seguindo' : 'Seguir' }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFollowsStore } from '@/stores/follows';
import Avatar from '@/components/ui/Avatar.vue';
import { ROUTE_NAMES } from '@/router/routeNames';

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  showFollowButton: {
    type: Boolean,
    default: true
  }
});

const followsStore = useFollowsStore();

const isFollowing = computed(() => followsStore.isFollowing(props.user.id));

const profileLink = computed(() => ({
  name: ROUTE_NAMES.PROFILE,
  query: { user: props.user.username }
}));
</script>