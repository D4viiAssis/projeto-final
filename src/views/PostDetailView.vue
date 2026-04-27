<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFeedStore } from '@/stores/feed';
import api from '@/services/api';
import Avatar from '@/components/ui/Avatar.vue';
import Spinner from '@/components/ui/Spinner.vue';
import { formatCount } from '@/utils/format';
import { timeAgo } from '@/utils/date';

const route = useRoute();
const router = useRouter();
const feedStore = useFeedStore();

const post = ref(null);
const comments = ref([]);
const isLoading = ref(true);
const commentBody = ref('');
const isSubmitting = ref(false);

const loadPostData = async () => {
  isLoading.value = true;
  try {
    // Busca os detalhes do post
    const postRes = await api.get(`/posts/${route.params.postId}`);
    post.value = postRes.data;

    // Busca os comentários do post (Rota: GET /posts/{post}/comments)
    const commentsRes = await api.get(`/posts/${route.params.postId}/comments`);
    comments.value = commentsRes.data.data || commentsRes.data;
  } catch (error) {
    console.error("Erro ao carregar post:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadPostData);

const handleLike = async () => {
  // Como o post pode não estar no feedById da store, atualizamos localmente primeiro
  const originalLiked = post.value.liked_by_me;
  const originalCount = post.value.likes_count;

  post.value.liked_by_me = !post.value.liked_by_me;
  post.value.likes_count += post.value.liked_by_me ? 1 : -1;

  try {
    if (post.value.liked_by_me) {
      await api.post(`/posts/${post.value.id}/like`);
    } else {
      await api.delete(`/posts/${post.value.id}/like`);
    }
  } catch (error) {
    post.value.liked_by_me = originalLiked;
    post.value.likes_count = originalCount;
  }
};

const handleComment = async () => {
  if (!commentBody.value.trim() || isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const { data } = await api.post(`/posts/${post.value.id}/comments`, {
      body: commentBody.value
    });
    // Adiciona o novo comentário no topo da lista
    comments.value.unshift(data);
    commentBody.value = '';
    if (post.value) post.value.comments_count++;
  } catch (error) {
    alert('Erro ao publicar comentário');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="container py-4" style="max-width: 935px;">
    <div v-if="isLoading" class="text-center py-5">
      <Spinner size="lg" />
    </div>

    <div v-else-if="post" class="card overflow-hidden shadow-sm border">
      <div class="row g-0">
        <div class="col-md-7 bg-light border-end d-flex align-items-center">
          <img :src="post.image_url" class="img-fluid w-100 h-100 object-fit-cover" :alt="post.caption">
        </div>

        <div class="col-md-5 d-flex flex-column" style="max-height: 80vh;">
          <div class="p-3 border-bottom d-flex align-items-center justify-content-between">
            <router-link :to="`/perfil?user=${post.user.username}`" class="d-flex align-items-center text-decoration-none text-dark">
              <img 
                :src="post.user.avatar_url || 'https://ui-avatars.com/api/?name=' + post.user.name" 
                class="rounded-circle border me-2" 
                style="width: 32px; height: 32px; object-fit: cover;"
              />
              <span class="fw-bold">{{ post.user.username }}</span>
            </router-link>
          </div>

          <div class="flex-grow-1 overflow-auto p-3 bg-white" style="font-size: 0.9rem;">
            <div class="d-flex mb-3" v-if="post.caption">
              <span class="fw-bold me-2">{{ post.user.username }}</span>
              <span class="text-break">{{ post.caption }}</span>
            </div>

            <hr v-if="post.caption && comments.length > 0">

            <div v-for="comment in comments" :key="comment.id" class="d-flex mb-3">
              <router-link :to="`/perfil?user=${comment.user.username}`">
                <img 
                  :src="comment.user.avatar_url || 'https://ui-avatars.com/api/?name=' + comment.user.name" 
                  class="rounded-circle border me-2" 
                  style="width: 28px; height: 28px; object-fit: cover;"
                />
              </router-link>
              <div class="text-start">
                <span class="fw-bold me-2">{{ comment.user.username }}</span>
                <span class="text-break">{{ comment.body }}</span>
                <div class="text-muted mt-1" style="font-size: 0.75rem;">
                  {{ timeAgo(comment.created_at) }}
                </div>
              </div>
            </div>

            <div v-if="comments.length === 0" class="text-center py-4 text-muted italic">
              Ainda não há comentários. Seja o primeiro a comentar!
            </div>
          </div>

          <div class="p-3 border-top mt-auto">
            <div class="d-flex gap-3 mb-2">
              <button @click="handleLike" class="btn-icon">
                <i v-if="post.liked_by_me" class="bi bi-heart-fill text-danger"></i>
                <i v-else class="bi bi-heart text-dark"></i>
              </button>
            </div>
            <p class="fw-bold mb-1 small text-start">{{ formatCount(post.likes_count || 0) }} curtidas</p>
            <div class="text-muted text-uppercase text-start" style="font-size: 10px;">
              {{ timeAgo(post.created_at) }}
            </div>
          </div>

          <div class="p-3 border-top">
            <form @submit.prevent="handleComment" class="d-flex align-items-center">
              <input 
                v-model="commentBody" 
                type="text" 
                class="form-control form-control-sm border-0 shadow-none p-0" 
                placeholder="Adicione um comentário..."
                :disabled="isSubmitting"
              >
              <button 
                type="submit" 
                class="btn btn-sm text-primary fw-bold" 
                :disabled="!commentBody.trim() || isSubmitting"
              >
                Publicar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.object-fit-cover { object-fit: cover; }
.btn-icon { background: none; border: none; padding: 0; cursor: pointer; line-height: 1; }
.btn-icon i { font-size: 1.5rem; }
.btn-icon:active { transform: scale(1.2); }
.text-break { word-break: break-word; }
/* Estilização básica do scroll */
.overflow-auto::-webkit-scrollbar { width: 4px; }
.overflow-auto::-webkit-scrollbar-thumb { background: #dbdbdb; border-radius: 10px; }
</style>