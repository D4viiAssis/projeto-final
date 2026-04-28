<template>
  <div class="profile-post-grid">
    <div class="row g-1">
      <div
        v-for="post in posts"
        :key="post.id"
        class="col-4"
      >
        <router-link
          :to="{ name: ROUTE_NAMES.POST_DETAILS, params: { postId: post.id } }"
          class="d-block position-relative"
        >
          <img
            :src="post.image_url"
            :alt="post.caption"
            class="img-fluid w-100 h-100 object-fit-cover"
            style="aspect-ratio: 1;"
          />
          <div class="overlay d-flex align-items-center justify-content-center">
            <div class="stats text-white">
              <AppIcon name="heart" filled class="me-2" />
              {{ post.likes_count }}
              <AppIcon name="chat" class="ms-3 me-2" />
              {{ post.comments_count }}
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppIcon from '@/components/layout/AppIcon.vue';
import { ROUTE_NAMES } from '@/router/routeNames';

defineProps({
  posts: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
}

.overlay:hover {
  opacity: 1;
}

.stats {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>