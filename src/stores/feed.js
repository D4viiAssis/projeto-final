import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export const useFeedStore = defineStore('feed', () => {
  const postsById = ref({});
  const feedOrder = ref([]);
  const nextCursor = ref(null);
  const isLoading = ref(false);

  // Getters
  const feedPosts = computed(() => feedOrder.value.map(id => postsById.value[id]));
  const getPostById = (id) => computed(() => postsById.value[id]);

  // Actions
  const fetchFeed = async () => {
    isLoading.value = true;
    try {
      const { data } = await api.get('/feed');
      // Normalização
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

  const loadMoreFeed = async () => {
    if (!nextCursor.value) return;
    try {
      const { data } = await api.get(`/feed?cursor=${nextCursor.value}`);
      const posts = data.data || data;
      posts.forEach(post => {
        postsById.value[post.id] = post;
      });
      feedOrder.value.push(...posts.map(p => p.id));
      nextCursor.value = data.next_cursor || null;
    } catch (error) {
      console.error(error);
    }
  };

  const toggleLike = async (postId) => {
    const post = postsById.value[postId];
    if (!post) return;

    // Atualização otimista
    const originalIsLiked = post.isLiked;
    const originalLikesCount = post.likesCount;

    post.isLiked = !post.isLiked;
    post.likesCount += post.isLiked ? 1 : -1;

    try {
      if (post.isLiked) {
        await api.post(`/posts/${postId}/like`);
      } else {
        await api.delete(`/posts/${postId}/unlike`);
      }
    } catch (error) {
      // Reverte em caso de erro
      post.isLiked = originalIsLiked;
      post.likesCount = originalLikesCount;
    }
  };

  const addComment = async (postId, body) => {
    const { data } = await api.post(`/posts/${postId}/comments`, { body });
    const post = postsById.value[postId];
    if (post) {
      if (!post.comments) post.comments = [];
      post.comments.unshift(data);
    }
  };

  const createPost = async (formData) => {
    const { data } = await api.post('/posts', formData);
    postsById.value[data.id] = data;
    feedOrder.value.unshift(data.id);
  };

  const removePost = (postId) => {
    delete postsById.value[postId];
    feedOrder.value = feedOrder.value.filter(id => id !== postId);
  };

  return {
    postsById,
    feedOrder,
    nextCursor,
    isLoading,
    feedPosts,
    getPostById,
    fetchFeed,
    loadMoreFeed,
    toggleLike,
    addComment,
    createPost,
    removePost
  };
});