import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { authService } from '@/services/auth.service';
import { useFollowsStore } from '@/stores/follows';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);

  const isAuthenticated = computed(() => !!token.value);

  const init = async () => {
    const savedToken = localStorage.getItem('instaclone.token');
    if (savedToken) {
      token.value = savedToken;
      await fetchMe();
      if (user.value) {
        const followsStore = useFollowsStore();
        await followsStore.fetchFollowingList(user.value.id);
      }
    }
  };

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    token.value = data.access_token;
    user.value = data.user;
    localStorage.setItem('instaclone.token', data.access_token);
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    token.value = data.access_token;
    user.value = data.user;
    localStorage.setItem('instaclone.token', data.access_token);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Falha silenciosa
    } finally {
      localStorage.removeItem('instaclone.token');
      token.value = null;
      user.value = null;
    }
  };

  const fetchMe = async () => {
    try {
      user.value = await authService.fetchMe();
    } catch (error) {
      await logout();
    }
  };

  // ROTA 1: Atualiza Nome e Bio (PUT)
  const updateProfile = async (profileData) => {
    try {
      user.value = await authService.updateProfile(profileData);
      return user.value;
    } catch (error) {
      console.error("Erro ao atualizar textos:", error);
      throw error;
    }
  };

  // ROTA 2: Atualiza apenas o Avatar (POST)
  const updateAvatar = async (file) => {
    try {
      user.value = await authService.updateAvatar(file);
      return user.value;
    } catch (error) {
      console.error("Erro ao fazer upload do avatar:", error);
      throw error;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    init,
    login,
    register,
    logout,
    fetchMe,
    updateProfile,
    updateAvatar
  };
});