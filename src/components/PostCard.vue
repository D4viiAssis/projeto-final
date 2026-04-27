<script setup>
import { useFeedStore } from '@/stores/feed';
import Avatar from '@/components/ui/Avatar.vue';
import { formatCount } from '@/utils/format';
import { timeAgo } from '@/utils/date';

const props = defineProps({
  post: { type: Object, required: true }
});

const feedStore = useFeedStore();

const handleLike = () => {
  feedStore.toggleLike(props.post.id);
};
</script>

<template>
  <div class="post-card mb-4">
    <div class="post-header d-flex align-items-center p-3">
      <router-link :to="`/perfil?user=${post.user.username}`" class="d-flex align-items-center text-decoration-none">
        <Avatar size="sm" :src="post.user.profile_photo_url || post.user.avatarUrl" :alt="post.user.username" />
        <span class="ms-2 fw-bold text-dark">{{ post.user.username }}</span>
      </router-link>
    </div>

    <div class="post-image border-top border-bottom bg-light">
      <img :src="post.image_url || post.imageUrl" class="img-fluid w-100" :alt="post.caption || post.description">
    </div>

    <div class="post-actions p-3 pb-0 d-flex justify-content-start">
      <button 
        @click="handleLike" 
        class="btn-icon" 
        type="button"
        aria-label="Curtir"
      >
        <i v-if="post.isLiked" class="bi bi-heart-fill text-danger"></i>
        <i v-else class="bi bi-heart text-dark"></i>
      </button>
    </div>

    <div class="post-content p-3 pt-2 text-start">
      <p class="fw-bold mb-1 text-dark">
        {{ formatCount(post.likes_count || post.likesCount) }} curtidas
      </p>
      
      <p class="mb-1 text-dark">
        <span class="fw-bold me-2">{{ post.user.username }}</span>
        {{ post.caption || post.description }}
      </p>

      <router-link 
        v-if="(post.comments_count || post.commentsCount) > 0" 
        :to="`/posts/${post.id}`" 
        class="text-muted small text-decoration-none d-block mb-1"
      >
        Ver todos os {{ post.comments_count || post.commentsCount }} comentários
      </router-link>

      <div class="text-muted text-uppercase" style="font-size: 10px;">
        {{ timeAgo(post.created_at || post.createdAt) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Seu CSS estava excelente, mantive 100% dele */
.post-card {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  overflow: hidden;
  max-width: 100%;
}

.post-image img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
}

.btn-icon {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.1s ease;
  line-height: 1;
}

.btn-icon i {
  font-size: 1.6rem;
}

.btn-icon:active {
  transform: scale(1.2);
}

.text-start {
  text-align: left !important;
}

.text-dark {
  color: #262626 !important;
}
</style>