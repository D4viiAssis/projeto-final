import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('instaclone.token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    // Inicializa a sessão buscando dados do usuário se houver token
    async init() {
      if (this.token) {
        try {
          await this.fetchMe();
        } catch (error) {
          this.logout();
        }
      }
    },

    async login(email, password) {
      const { data } = await api.post('/auth/login', { email, password });
      this.setAuth(data.access_token, data.user);
    },

    async register(name, username, email, password, password_confirmation) {
      const { data } = await api.post('/auth/register', {
        name,
        username,
        email,
        password,
        password_confirmation,
      });
      this.setAuth(data.access_token, data.user);
    },

    async logout() {
      try {
        await api.post('/auth/logout');
      } catch {
        // Silencioso conforme requisito: limpa o estado mesmo se a API falhar
      } finally {
        this.user = null;
        this.token = null;
        localStorage.removeItem('instaclone.token');
      }
    },

    async fetchMe() {
      const { data } = await api.get('/auth/me');
      this.user = data;
    },

    setAuth(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem('instaclone.token', token);
    },

    updateProfile(data) {
      // Atualiza o objeto user localmente após edição no perfil
      if (this.user) {
        this.user = { ...this.user, ...data };
      }
    }
  },
});