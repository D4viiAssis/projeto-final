<script setup>
import { ref } from 'vue';
import { useFeedStore } from '@/stores/feed';
import Avatar from '@/components/ui/Avatar.vue';
import { formatCount } from '@/utils/format';
import { timeAgo } from '@/utils/date';
// Importação do novo modal de curtidas
import LikersModal from '@/components/LikersModal.vue';

const props = defineProps({
  post: { type: Object, required: true }
});

const feedStore = useFeedStore();
const commentBody = ref('');
const isSubmittingComment = ref(false);
// Estado para controlar a visibilidade do modal
const showLikers = ref(false);

const handleLike = () => {
  feedStore.toggleLike(props.post.id);
};

const handleComment = async () => {
  if (!commentBody.value.trim() || isSubmittingComment.value) return;
  
  isSubmittingComment.value = true;
  try {
    await feedStore.addComment(props.post.id, commentBody.value);
    commentBody.value = ''; // Limpa o campo após comentar
  } catch (error) {
    alert('Erro ao enviar comentário');
  } finally {
    isSubmittingComment.value = false;
  }
};
</script>

<template>
  <div class="post-card mb-4">
    <div class="post-header d-flex align-items-center justify-content-between">
      <router-link :to="`/perfil?user=${post.user.username}`" class="d-flex align-items-center text-decoration-none">
        <img 
          :src="post.user.avatar_url || 'https://ui-avatars.com/api/?name=' + post.user.name" 
          class="avatar rounded-circle border me-3" 
          alt="Avatar"
        />
        <div>
          <div class="username mb-0">{{ post.user.username }}</div>
          <div class="user-handle small text-muted">{{ post.user.name }}</div>
        </div>
      </router-link>
      <button class="btn-options btn-icon" type="button">
        <i class="bi bi-three-dots"></i>
      </button>
    </div>

    <div class="post-image">
      <img :src="post.image_url" alt="Post image" />
    </div>

    <div class="post-body px-3 py-3">
      <div class="action-row mb-3 d-flex align-items-center">
        <button @click="handleLike" class="btn-icon icon-button" type="button">
          <i v-if="post.liked_by_me" class="bi bi-heart-fill liked"></i>
          <i v-else class="bi bi-heart"></i>
          <span class="action-count">{{ formatCount(post.likes_count || 0) }}</span>
        </button>
        <router-link :to="`/posts/${post.id}`" class="btn-icon icon-button ms-3">
          <i class="bi bi-chat"></i>
          <span class="action-count">{{ formatCount(post.comments_count || 0) }}</span>
        </router-link>
        <div class="flex-fill"></div>
      </div>

      <div class="post-caption mb-2">
        <span class="fw-bold me-2">{{ post.user.username }}</span>{{ post.caption }}
      </div>

      <router-link 
        v-if="post.comments_count > 0" 
        :to="`/posts/${post.id}`" 
        class="comments-link small text-muted text-decoration-none d-block mb-2"
      >
        Ver todos os {{ post.comments_count }} comentários
      </router-link>

      <div class="post-time small text-muted text-uppercase">
        {{ timeAgo(post.created_at) }}
      </div>
    </div>

    <div class="comment-bar px-3 py-3 border-top">
      <form @submit.prevent="handleComment" class="d-flex align-items-center gap-2">
        <input 
          v-model="commentBody" 
          type="text" 
          class="form-control comment-input" 
          placeholder="Adicione um comentário..."
          :disabled="isSubmittingComment"
        />
        <button 
          type="submit" 
          class="btn btn-link publish-btn fw-bold" 
          :disabled="!commentBody.trim() || isSubmittingComment"
        >
          Publicar
        </button>
      </form>
    </div>

    <LikersModal 
      v-if="showLikers" 
      :postId="post.id" 
      @close="showLikers = false" 
    />
  </div>
</template>

<style scoped>
.post-card {
  background: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.05);
}

.post-header {
  padding: 16px;
}

.avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.username {
  font-weight: 700;
  font-size: 0.95rem;
  color: #111827;
}

.user-handle {
  color: #6b7280;
}

.btn-options {
  color: #6b7280;
}

.post-image {
  background: #f8fafc;
}

.post-image img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.post-body {
  padding-bottom: 0;
}

.action-row {
  padding-bottom: 6px;
  border-bottom: 1px solid #f3f4f6;
}

.btn-icon {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  line-height: 1;
  color: #111827;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.action-count {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
}

.btn-icon i {
  font-size: 1.35rem;
}

.btn-icon:active {
  transform: scale(1.05);
}

.liked {
  color: #ef4444;
}

.likes-summary {
  display: block;
  font-weight: 700;
  color: #111827;
  background: transparent;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
}

.post-caption {
  line-height: 1.5;
  color: #374151;
}

.comments-link {
  color: #6b7280;
}

.post-time {
  letter-spacing: 0.08em;
}

.comment-bar {
  background: #fafafa;
}

.comment-input {
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 10px 16px;
  min-height: 40px;
  color: #111827;
}

.comment-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  border-color: #93c5fd;
}

.publish-btn {
  color: #2563eb;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.publish-btn:disabled {
  opacity: 0.45;
}
</style>