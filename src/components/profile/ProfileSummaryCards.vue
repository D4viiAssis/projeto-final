<template>
  <div class="profile-summary-cards d-flex justify-content-around mb-4">
    <router-link
      :to="{ name: ROUTE_NAMES.PROFILE_CONNECTIONS, params: { type: 'followers' }, query: { user: user.username } }"
      class="text-decoration-none text-dark text-center"
    >
      <div class="card border-0">
        <div class="card-body">
          <h5 class="card-title mb-1">{{ followersCount }}</h5>
          <p class="card-text text-muted">Seguidores</p>
        </div>
      </div>
    </router-link>
    <router-link
      :to="{ name: ROUTE_NAMES.PROFILE_CONNECTIONS, params: { type: 'following' }, query: { user: user.username } }"
      class="text-decoration-none text-dark text-center"
    >
      <div class="card border-0">
        <div class="card-body">
          <h5 class="card-title mb-1">{{ followingCount }}</h5>
          <p class="card-text text-muted">Seguindo</p>
        </div>
      </div>
    </router-link>
    <div class="text-center">
      <div class="card border-0">
        <div class="card-body">
          <h5 class="card-title mb-1">{{ postsCount }}</h5>
          <p class="card-text text-muted">Posts</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ROUTE_NAMES } from '@/router/routeNames';

defineProps({
  user: { type: Object, required: true },
  postsCount: { type: Number, default: 0 },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 }
});
</script>