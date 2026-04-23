<script setup>
import { useFeedStore } from '@/stores/feed';
import Avatar from '@/components/ui/Avatar.vue';

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
      <Avatar size="sm" :src="post.user.avatarUrl" :alt="post.user.username" />
      <span class="ms-2 fw-bold text-dark">{{ post.user.username }}</span>
    </div>

    <div class="post-image border-top border-bottom bg-light">
      <img :src="post.imageUrl" class="img-fluid w-100" :alt="post.description">
    </div>

    <div class="post-actions p-3 pb-0 d-flex justify-content-start">
      <button 
        @click="handleLike" 
        class="btn-icon" 
        type="button"
        title="Curtir"
      >
        <i v-if="post.isLiked" class="bi bi-heart-fill text-danger"></i>
        <i v-else class="bi bi-heart text-dark"></i>
      </button>
    </div>

    <div class="post-content p-3 pt-2 text-start">
      <p class="fw-bold mb-1 text-dark">{{ post.likesCount }} curtidas</p>
      <p class="mb-2 text-dark">
        <span class="fw-bold me-2">{{ post.user.username }}</span>
        {{ post.description }}
      </p>
      <div v-if="post.commentsCount > 0" class="text-muted small cursor-pointer">
        Ver todos os {{ post.commentsCount }} comentários
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-card {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  overflow: hidden;
  max-width: 100%;
}

.post-image img {
  width: 100%;
  aspect-ratio: 1 / 1; /* Garante o formato Instagram */
  object-fit: cover;
  display: block;
}

.btn-icon {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.1s ease;
  line-height: 1; /* Remove espaços extras do ícone */
}

.btn-icon i {
  font-size: 1.6rem; /* Tamanho do ícone de coração */
}

.btn-icon:active {
  transform: scale(1.2);
}

.text-start {
  text-align: left !important;
}

/* Garante que o texto não herde cores estranhas */
.text-dark {
  color: #262626 !important;
}
</style>