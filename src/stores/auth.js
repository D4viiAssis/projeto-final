import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);

  const isAuthenticated = computed(() => !!token.value);

  const init = async () => {
    const savedToken = localStorage.getItem('instaclone.token');
    if (savedToken) {
      token.value = savedToken;
      await fetchMe();
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    token.value = data.access_token;
    user.value = data.user;
    localStorage.setItem('instaclone.token', data.access_token);
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    token.value = data.access_token;
    user.value = data.user;
    localStorage.setItem('instaclone.token', data.access_token);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
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
      const { data } = await api.get('/auth/me');
      user.value = data;
    } catch (error) {
      await logout();
    }
  };

  // ROTA 1: Atualiza Nome e Bio (PUT)
  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/users/me', profileData);
      user.value = data; 
      return data;
    } catch (error) {
      console.error("Erro ao atualizar textos:", error);
      throw error;
    }
  };

  // ROTA 2: Atualiza apenas o Avatar (POST)
  const updateAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const { data } = await api.post('/users/me/avatar', formData);
      user.value = data; 
      return data;
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