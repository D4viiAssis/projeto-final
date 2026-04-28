import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';
import { defaultAuthor } from './profileUtils';

export const useFeedStore = defineStore('feed', () => {
  const postsById = ref({});
  const feedOrder = ref([]);
  const nextCursor = ref(null);
  const isLoading = ref(false);

  const feedPosts = computed(() => feedOrder.value.map(id => postsById.value[id]));


  const normalizeComment = (comment) => ({
    id: comment.id,
    body: comment.body,
    created_at: comment.created_at,
    user: comment.user || defaultAuthor()
  });

  const fetchFeed = async (cursor = null) => {
    isLoading.value = true;
    try {
      const endpoint = cursor ? `/feed?cursor=${cursor}` : '/feed';
      const { data } = await api.get(endpoint);
      
      const posts = data.data || data.items || [];
      
      posts.forEach(post => {
        // Normaliza o post se necessário
        postsById.value[post.id] = {
          ...post,
          author: post.user || post.author || defaultAuthor()
        };
      });

      if (cursor) {
        // Paginação: Adiciona ao final
        feedOrder.value = [...feedOrder.value, ...posts.map(p => p.id)];
      } else {
        // Refresh: Substitui a lista
        feedOrder.value = posts.map(p => p.id);
      }

      nextCursor.value = data.next_cursor || null;
    } finally {
      isLoading.value = false;
    }
  };

  const toggleLike = async (postId) => {
    const post = postsById.value[postId];
    if (!post) return;

    const originalState = { 
      liked: post.liked_by_me, 
      count: post.likes_count 
    };

    // UI Otimista
    post.liked_by_me = !post.liked_by_me;
    post.likes_count = post.liked_by_me ? (post.likes_count || 0) + 1 : Math.max(0, post.likes_count - 1);

    try {
      if (post.liked_by_me) {
        await api.post(`/posts/${postId}/like`);
      } else {
        await api.delete(`/posts/${postId}/like`);
      }
    } catch (error) {
      // Reverte em caso de erro
      post.liked_by_me = originalState.liked;
      post.likes_count = originalState.count;
    }
  };

  const addComment = async (postId, body) => {
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { body });
      const post = postsById.value[postId];
      
      if (post) {
        post.comments_count = (post.comments_count || 0) + 1;
        // Se o post tiver uma lista de comentários carregada localmente, podemos injetar aqui
      }
      return normalizeComment(data);
    } catch (error) {
      console.error("Erro ao comentar:", error);
      throw error;
    }
  };

  const createPost = async (formData) => {
    try {
      // O FormData já deve conter 'image' e 'caption' (conforme ajustamos na View)
      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Adiciona o novo post no topo do feed localmente
      const newPost = data.data || data;
      postsById.value[newPost.id] = {
        ...newPost,
        author: newPost.user || defaultAuthor()
      };
      feedOrder.value = [newPost.id, ...feedOrder.value];
      
      return newPost;
    } catch (error) {
      console.error('Erro ao criar post:', error);
      throw error;
    }
  };

  return {
    postsById,
    nextCursor,
    isLoading,
    feedPosts,
    fetchFeed,
    toggleLike,
    addComment,
    createPost,
  };
});