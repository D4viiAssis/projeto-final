import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para enviar o Token em todas as chamadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('instaclone.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros globais (Ex: Token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se for 401 e NÃO estivermos na página de login, aí sim redireciona
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('instaclone.token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;