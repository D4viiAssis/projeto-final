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
  <div class="post-card mb-4 bg-white border rounded">
    <div class="post-header d-flex align-items-center p-3">
      <router-link :to="`/perfil?user=${post.user.username}`" class="d-flex align-items-center text-decoration-none">
        <img 
          :src="post.user.avatar_url || 'https://ui-avatars.com/api/?name=' + post.user.name" 
          class="rounded-circle border me-2" 
          style="width: 32px; height: 32px; object-fit: cover;"
        />
        <span class="fw-bold text-dark">{{ post.user.username }}</span>
      </router-link>
    </div>

    <div class="post-image bg-light">
      <img :src="post.image_url" class="img-fluid w-100" style="aspect-ratio: 1/1; object-fit: cover;">
    </div>

    <div class="p-3 pb-0 text-start">
      <div class="d-flex gap-3 mb-2">
        <button @click="handleLike" class="btn-icon" type="button">
          <i v-if="post.liked_by_me" class="bi bi-heart-fill text-danger"></i>
          <i v-else class="bi bi-heart text-dark"></i>
        </button>
        <router-link :to="`/posts/${post.id}`" class="btn-icon">
          <i class="bi bi-chat text-dark"></i>
        </router-link>
      </div>

      <p 
        class="fw-bold mb-1 text-dark small cursor-pointer" 
        @click="showLikers = true"
        style="cursor: pointer; user-select: none;"
      >
        {{ formatCount(post.likes_count || 0) }} curtidas
      </p>
      
      <p class="mb-1 text-dark small">
        <span class="fw-bold me-2">{{ post.user.username }}</span>
        {{ post.caption }}
      </p>

      <router-link 
        v-if="post.comments_count > 0" 
        :to="`/posts/${post.id}`" 
        class="text-muted small text-decoration-none d-block mb-1"
      >
        Ver todos os {{ post.comments_count }} comentários
      </router-link>

      <div class="text-muted text-uppercase" style="font-size: 10px;">
        {{ timeAgo(post.created_at) }}
      </div>
    </div>

    <div class="border-top mt-3 px-3 py-2">
      <form @submit.prevent="handleComment" class="d-flex align-items-center">
        <input 
          v-model="commentBody" 
          type="text" 
          class="form-control form-control-sm border-0 shadow-none p-0" 
          placeholder="Adicione um comentário..."
          :disabled="isSubmittingComment"
        >
        <button 
          type="submit" 
          class="btn btn-sm text-primary fw-bold" 
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
.btn-icon { background: none; border: none; padding: 0; cursor: pointer; line-height: 1; }
.btn-icon i { font-size: 1.5rem; }
.btn-icon:active { transform: scale(1.2); }
.text-start { text-align: left !important; }
.cursor-pointer { cursor: pointer; }

/* Garante que o input não tenha outline azul ao clicar */
input:focus {
  outline: none;
  box-shadow: none;
}
</style>