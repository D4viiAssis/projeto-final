import { defineStore } from 'pinia';
import api from '@/services/api';

export const useFeedStore = defineStore('feed', {
  state: () => ({
    postsById: {},
    feedOrder: [],
    nextCursor: null,
    isLoading: false,
  }),

  getters: {
    feedPosts: (state) => state.feedOrder.map(id => state.postsById[id]),
  },

  actions: {
    async fetchFeed() {
      this.isLoading = true;
      try {
        const { data } = await api.get('/feed');
        
        this.postsById = {};
        this.feedOrder = [];
        
        this.processPosts(data.data);
        this.nextCursor = data.next_cursor;
      } catch (error) {
        console.error("Erro ao buscar feed:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async loadMoreFeed() {
      if (!this.nextCursor || this.isLoading) return;
      this.isLoading = true;
      try {
        const { data } = await api.get(`/feed?cursor=${this.nextCursor}`);
        this.processPosts(data.data);
        this.nextCursor = data.next_cursor;
      } catch (error) {
        console.error("Erro ao carregar mais:", error);
      } finally {
        this.isLoading = false;
      }
    },

    processPosts(posts) {
      if (!posts || !Array.isArray(posts)) return;
      posts.forEach(post => {
        this.postsById[post.id] = post;
        if (!this.feedOrder.includes(post.id)) {
          this.feedOrder.push(post.id);
        }
      });
    },

    async toggleLike(postId) {
      const post = this.postsById[postId];
      if (!post) return;

      const previouslyLiked = post.isLiked;
      const previousCount = post.likesCount;

      post.isLiked = !previouslyLiked;
      post.likesCount += post.isLiked ? 1 : -1;

      try {
        if (previouslyLiked) {
          await api.delete(`/posts/${postId}/like`);
        } else {
          await api.post(`/posts/${postId}/like`);
        }
      } catch (error) {
        post.isLiked = previouslyLiked;
        post.likesCount = previousCount;
        console.error("Erro no like:", error);
      }
    },

    async createPost(formData) {
      try {
        // Envia para a API e deixa ela processar
        const response = await api.post('/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        // Retornamos apenas para sinalizar sucesso no componente
        return response.data;
      } catch (error) {
        console.error("Erro ao criar post:", error);
        throw error;
      }
    }
  },
});