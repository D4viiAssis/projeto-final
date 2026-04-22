import { defineStore } from 'pinia';
import api from '@/services/api';

export const useFeedStore = defineStore('feed', {
  state: () => ({
    postsById: {},      // Dicionário para acesso rápido { [id]: post }
    feedOrder: [],      // Array de IDs para manter a ordem cronológica
    nextCursor: null,
    isLoading: false,
  }),

  getters: {
    feedPosts: (state) => state.feedOrder.map(id => state.postsById[id]),
    getPostById: (state) => (id) => state.postsById[id],
  },

  actions: {
    async fetchFeed() {
      this.isLoading = true;
      try {
        const { data } = await api.get('/feed');
        // Limpa estado anterior no carregamento inicial
        this.postsById = {};
        this.feedOrder = [];
        
        this.processPosts(data.data);
        this.nextCursor = data.next_cursor;
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
      } finally {
        this.isLoading = false;
      }
    },

    processPosts(posts) {
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

      // --- Atualização Otimista ---
      const previouslyLiked = post.isLiked;
      post.isLiked = !previouslyLiked;
      post.likesCount += post.isLiked ? 1 : -1;

      try {
        if (previouslyLiked) {
          await api.delete(`/posts/${postId}/unlike`);
        } else {
          await api.post(`/posts/${postId}/like`);
        }
      } catch (error) {
        // Reverte em caso de erro na API
        post.isLiked = previouslyLiked;
        post.likesCount += previouslyLiked ? 1 : -1;
      }
    },

    async addComment(postId, body) {
      const { data } = await api.post(`/posts/${postId}/comments`, { body });
      const post = this.postsById[postId];
      if (post) {
        // Assume que o post tem uma lista de comentários ou incrementa contador
        if (!post.comments) post.comments = [];
        post.comments.push(data);
        post.commentsCount++;
      }
    },

    async createPost(formData) {
      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Adiciona o novo post no topo do feed
      this.postsById[data.id] = data;
      this.feedOrder.unshift(data.id);
    },

    removePost(postId) {
      delete this.postsById[postId];
      this.feedOrder = this.feedOrder.filter(id => id !== postId);
    }
  },
});