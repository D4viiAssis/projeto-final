import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export const useFeedStore = defineStore('feed', () => {
  const postsById = ref({});
  const feedOrder = ref([]);
  const nextCursor = ref(null);
  const isLoading = ref(false);

  const feedPosts = computed(() => feedOrder.value.map(id => postsById.value[id]));

  const fetchFeed = async () => {
    isLoading.value = true;
    try {
      const { data } = await api.get('/feed');
      const posts = data.data || data;
      posts.forEach(post => {
        postsById.value[post.id] = post;
      });
      feedOrder.value = posts.map(p => p.id);
      nextCursor.value = data.next_cursor || null;
    } finally {
      isLoading.value = false;
    }
  };

  const toggleLike = async (postId) => {
    const post = postsById.value[postId];
    if (!post) return;

    // Atualização otimista usando os nomes do SEU backend
    const originalLikedByMe = post.liked_by_me;
    const originalLikesCount = post.likes_count || 0;

    post.liked_by_me = !post.liked_by_me;
    post.likes_count = post.liked_by_me ? originalLikesCount + 1 : originalLikesCount - 1;

    try {
      if (post.liked_by_me) {
        await api.post(`/posts/${postId}/like`);
      } else {
        // Conforme seu api.php, o unlike é DELETE
        await api.delete(`/posts/${postId}/like`);
      }
    } catch (error) {
      // Reverte em caso de erro
      post.liked_by_me = originalLikedByMe;
      post.likes_count = originalLikesCount;
    }
  };

  const addComment = async (postId, body) => {
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { body });
      const post = postsById.value[postId];
      if (post) {
        // Incrementa o contador de comentários
        post.comments_count = (post.comments_count || 0) + 1;
      }
      return data;
    } catch (error) {
      console.error("Erro ao comentar:", error);
      throw error;
    }
  };

  return {
    postsById, feedOrder, nextCursor, isLoading, feedPosts,
    fetchFeed, toggleLike, addComment
  };
});