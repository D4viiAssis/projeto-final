<script setup>
import { ref } from 'vue';
import { useFeedStore } from '@/stores/feed';
import { formatCount } from '@/utils/format';
import { timeAgo } from '@/utils/date';
import LikersModal from '@/components/LikersModal.vue';

const props = defineProps({
  post: { type: Object, required: true }
});

const feedStore = useFeedStore();
const commentBody = ref('');
const isSubmittingComment = ref(false);
const showLikers = ref(false);
const showCentralHeart = ref(false); // Controla o coração gigante no meio

// Lógica de Double Tap
let lastTap = 0;
const handleDoubleTap = () => {
  const now = Date.now();
  if (now - lastTap < 300) {
    if (!props.post.liked_by_me) {
      handleLike();
    }
    // Sempre mostra a animação do coração no meio no double click
    showCentralHeart.value = true;
    setTimeout(() => { showCentralHeart.value = false; }, 1000);
  }
  lastTap = now;
};

const handleLike = () => {
  feedStore.toggleLike(props.post.id);
};

const handleComment = async () => {
  if (!commentBody.value.trim() || isSubmittingComment.value) return;
  isSubmittingComment.value = true;
  try {
    await feedStore.addComment(props.post.id, commentBody.value);
    commentBody.value = ''; 
  } catch (error) {
    alert('Erro ao enviar comentário');
  } finally {
    isSubmittingComment.value = false;
  }
};
</script>

<template>
  <div class="post-container mb-4">
    <div class="post-header d-flex align-items-center justify-content-between p-2 px-3">
      <router-link :to="`/perfil?user=${post.user.username}`" class="d-flex align-items-center text-decoration-none">
        <div class="avatar-ring">
          <img 
            :src="post.user.avatar_url || 'https://ui-avatars.com/api/?name=' + post.user.name" 
            class="avatar-img" 
          />
        </div>
        <div class="ms-2">
          <span class="username-text">{{ post.user.username }}</span>
        </div>
      </router-link>
      <button class="btn-more"><i class="bi bi-three-dots"></i></button>
    </div>

    <div class="post-image-wrapper" @click="handleDoubleTap">
      <img :src="post.image_url" class="main-img" loading="lazy" />
      
      <Transition name="heart-fade">
        <div v-if="showCentralHeart" class="central-heart">
          <i class="bi bi-heart-fill"></i>
        </div>
      </Transition>
    </div>

    <div class="post-metadata p-3 pt-2">
      <div class="action-buttons d-flex align-items-center mb-2">
        <button @click="handleLike" class="action-icon me-3">
          <i :key="post.liked_by_me" v-if="post.liked_by_me" class="bi bi-heart-fill text-danger anim-pop"></i>
          <i v-else class="bi bi-heart"></i>
        </button>
        <router-link :to="`/posts/${post.id}`" class="action-icon">
          <i class="bi bi-chat"></i>
        </router-link>
      </div>

      <div class="likes-text fw-bold mb-1" @click="showLikers = true">
        {{ formatCount(post.likes_count || 0) }} curtidas
      </div>

      <div class="caption-section">
        <span class="fw-bold me-1">{{ post.user.username }}</span>
        <span class="caption-text">{{ post.caption }}</span>
      </div>

      <router-link v-if="post.comments_count > 0" :to="`/posts/${post.id}`" class="comments-link d-block mt-1">
        Ver todos os {{ post.comments_count }} comentários
      </router-link>

      <div class="post-date mt-1">{{ timeAgo(post.created_at) }}</div>
    </div>

    <div class="comment-footer border-top px-3">
      <form @submit.prevent="handleComment" class="d-flex align-items-center">
        <input 
          v-model="commentBody" 
          type="text" 
          class="comment-input" 
          placeholder="Adicione um comentário..."
        />
        <button 
          type="submit" 
          class="post-btn" 
          :disabled="!commentBody.trim() || isSubmittingComment"
        >
          Publicar
        </button>
      </form>
    </div>

    <LikersModal v-if="showLikers" :postId="post.id" @close="showLikers = false" />
  </div>
</template>

<style scoped>
.post-container {
  background: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  max-width: 470px; /* Largura padrão do feed do Instagram */
  margin: 0 auto;
}

/* Header */
.avatar-ring {
  padding: 2px;
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  border-radius: 50%;
}
.avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  display: block;
}
.username-text {
  font-weight: 600;
  font-size: 0.9rem;
  color: #262626;
}
.btn-more { background: none; border: none; font-size: 1.1rem; }

/* Imagem e Coração Central */
.post-image-wrapper {
  position: relative;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.main-img { width: 100%; display: block; object-fit: contain; }

.central-heart {
  position: absolute;
  color: rgba(255, 255, 255, 0.9);
  font-size: 5rem;
  z-index: 10;
  pointer-events: none;
  filter: drop-shadow(0 0 10px rgba(0,0,0,0.2));
}

/* Transição do Coração Central */
.heart-fade-enter-active { animation: heart-pop-in 0.8s; }
.heart-fade-leave-active { opacity: 0; transition: opacity 0.2s; }

@keyframes heart-pop-in {
  0% { transform: scale(0); opacity: 0; }
  20% { transform: scale(1.2); opacity: 1; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.2); opacity: 0; }
}

/* Ações */
.action-icon {
  background: none;
  border: none;
  font-size: 1.5rem;
  padding: 0;
  color: #262626;
}
.anim-pop {
  display: inline-block;
  animation: mini-pop 0.3s cubic-bezier(0.17, 0.89, 0.32, 1.49);
}
@keyframes mini-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* Textos */
.likes-text { font-size: 0.9rem; cursor: pointer; }
.caption-text { font-size: 0.9rem; color: #262626; }
.comments-link { font-size: 0.85rem; color: #8e8e8e; text-decoration: none; }
.post-date { font-size: 0.65rem; color: #8e8e8e; text-transform: uppercase; }

/* Footer Comentário */
.comment-footer { min-height: 48px; display: flex; align-items: center; }
.comment-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9rem;
  padding: 10px 0;
}
.post-btn {
  background: none;
  border: none;
  color: #0095f6;
  font-weight: 600;
  font-size: 0.9rem;
}
.post-btn:disabled { color: #b2dffc; }

@media (max-width: 767px) {
  .post-container { border-radius: 0; border-left: none; border-right: none; }
}
</style>