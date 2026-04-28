import api from './api';

export const likesService = {
  async likePost(postId) {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  async unlikePost(postId) {
    await api.delete(`/posts/${postId}/unlike`);
  },

  async getPostLikes(postId) {
    const response = await api.get(`/posts/${postId}/likes`);
    return response.data;
  }
};