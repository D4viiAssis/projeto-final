import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);

  const isAuthenticated = computed(() => !!token.value);

  // Inicializa a store lendo o localStorage
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
    // userData deve conter: name, username, email, password, password_confirmation
    const { data } = await api.post('/auth/register', userData);
    token.value = data.access_token;
    user.value = data.user;
    localStorage.setItem('instaclone.token', data.access_token);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Falha silenciosa se o token já expirou
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

 const updateProfile = async (formData) => {
    try {
      // O Laravel geralmente espera POST com _method=PUT para upload de arquivos em updates
      if (!(formData instanceof FormData)) {
        throw new Error("Dados devem ser FormData");
      }
      
      const { data } = await api.post('/auth/me', formData); 
      user.value = data; // Atualiza o usuário globalmente
      return data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
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
    updateProfile
  };
});