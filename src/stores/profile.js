import { defineStore } from 'pinia';
import api from '@/services/api';
import { useAuthStore } from './auth';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    user: null,
    posts: [],
    isLoading: false,
  }),
  actions: {
    // Busca o MEU perfil (Logado)
    async fetchMyProfile() {
      const authStore = useAuthStore();
      this.isLoading = true;
      try {
        const userRes = await api.get('/auth/me');
        this.user = userRes.data;

        // Busca posts usando o MEU ID
        const userId = authStore.user?.id;
        if (userId) {
          const postsRes = await api.get(`/users/${userId}/posts`);
          this.posts = postsRes.data.data || postsRes.data;
        }
      } catch (error) {
        console.error("Erro ao carregar meu perfil:", error);
        this.user = authStore.user;
      } finally {
        this.isLoading = false;
      }
    },

    // NOVO: Busca o perfil de QUALQUER usuário pelo username
    async fetchUserProfile(username) {
      this.isLoading = true;
      try {
        // 1. Busca os dados do usuário alvo
        const userRes = await api.get(`/users/${username}`);
        this.user = userRes.data;

        // 2. Busca os posts desse usuário alvo usando o ID que veio na resposta
        const postsRes = await api.get(`/users/${this.user.id}/posts`);
        this.posts = postsRes.data.data || postsRes.data;
      } catch (error) {
        console.error("Erro ao carregar perfil de terceiros:", error);
        this.user = null;
      } finally {
        this.isLoading = false;
      }
    },

    // NOVO: Action para Seguir/Parar de seguir dentro do perfil
    async toggleFollow(userId) {
      if (!this.user) return;
      
      const originalState = this.user.is_following;
      const originalCount = this.user.followers_count;

      // Otimista
      this.user.is_following = !this.user.is_following;
      this.user.followers_count += this.user.is_following ? 1 : -1;

      try {
        if (this.user.is_following) {
          await api.post(`/users/${userId}/follow`);
        } else {
          await api.delete(`/users/${userId}/unfollow`);
        }
      } catch (error) {
        // Reverte se der ruim
        this.user.is_following = originalState;
        this.user.followers_count = originalCount;
      }
    }
  }
});