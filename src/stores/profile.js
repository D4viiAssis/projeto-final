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
    async fetchMyProfile() {
      this.isLoading = true;
      try {
        const userRes = await api.get('/auth/me');
        const userData = userRes.data;

        // Buscamos os contadores e posts para garantir que a tela não fique vazia
        const [followersRes, followingRes, postsRes] = await Promise.all([
          api.get(`/users/${userData.id}/followers`),
          api.get(`/users/${userData.id}/following`),
          api.get(`/users/${userData.id}/posts`)
        ]);

        userData.followers_count = followersRes.data.meta?.total || followersRes.data.length || 0;
        userData.following_count = followingRes.data.meta?.total || followingRes.data.length || 0;
        
        this.user = userData;
        this.posts = postsRes.data.data || postsRes.data;
      } catch (error) {
        console.error("Erro no meu perfil:", error);
      } finally { this.isLoading = false; }
    },

    async fetchUserProfile(username) {
      this.isLoading = true;
      try {
        const userRes = await api.get(`/users/${username}`);
        const userData = userRes.data;

        // BUSCA DA VERDADE: Injetamos o que o UserResource do back esquece
        const [followStatus, followersRes, followingRes, postsRes] = await Promise.all([
          api.get(`/users/${userData.id}/is-following`),
          api.get(`/users/${userData.id}/followers`),
          api.get(`/users/${userData.id}/following`),
          api.get(`/users/${userData.id}/posts`)
        ]);

        userData.is_following = !!followStatus.data.is_following;
        userData.followers_count = followersRes.data.meta?.total || followersRes.data.length || 0;
        userData.following_count = followingRes.data.meta?.total || followingRes.data.length || 0;

        this.user = userData;
        this.posts = postsRes.data.data || postsRes.data;
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        this.user = null;
      } finally { this.isLoading = false; }
    },

    async toggleFollow(userId) {
      if (!this.user) return;
      const authStore = useAuthStore();
      
      const originalState = this.user.is_following;
      const originalCount = Number(this.user.followers_count) || 0;

      // 1. Otimista
      this.user.is_following = !this.user.is_following;
      this.user.followers_count = this.user.is_following ? originalCount + 1 : Math.max(0, originalCount - 1);

      try {
        if (this.user.is_following) {
          await api.post(`/users/${userId}/follow`);
          if (authStore.user) authStore.user.following_count++;
        } else {
          await api.delete(`/users/${userId}/follow`);
          if (authStore.user) authStore.user.following_count--;
        }
        
        // 2. Verificação final para cravar o dado do banco
        const check = await api.get(`/users/${userId}/is-following`);
        this.user.is_following = !!check.data.is_following;
      } catch (error) {
        this.user.is_following = originalState;
        this.user.followers_count = originalCount;
      }
    }
  }
});