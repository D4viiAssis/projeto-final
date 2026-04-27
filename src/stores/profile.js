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
        // 1. Busca os dados do usuário logado
        const userRes = await api.get('/auth/me');
        const userData = userRes.data;

        // 2. Busca contadores reais (Se o back não mandar no objeto principal)
        // Tentamos buscar as listas para contar manualmente, já que o back não entrega o total pronto
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

        // BUSCA DA VERDADE: Como o UserResource é incompleto, buscamos tudo separado
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
      
      const originalState = this.user.is_following;
      const originalCount = Number(this.user.followers_count) || 0;

      // 1. UI Otimista
      this.user.is_following = !this.user.is_following;
      this.user.followers_count = this.user.is_following ? originalCount + 1 : Math.max(0, originalCount - 1);

      try {
        if (this.user.is_following) {
          await api.post(`/users/${userId}/follow`);
        } else {
          await api.delete(`/users/${userId}/follow`);
        }
        
        // 2. Após a ação, forçamos uma re-checagem dos contadores para garantir sincronia
        const [followersCheck, followCheck] = await Promise.all([
          api.get(`/users/${userId}/followers`),
          api.get(`/users/${userId}/is-following`)
        ]);
        
        this.user.followers_count = followersCheck.data.meta?.total || followersCheck.data.length || 0;
        this.user.is_following = !!followCheck.data.is_following;

      } catch (error) {
        this.user.is_following = originalState;
        this.user.followers_count = originalCount;
      }
    }
  }
});