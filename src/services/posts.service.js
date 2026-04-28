import api from './api';

export const postsService = {
  async createPost(formData) {
    const response = await api.post('/posts', formData);
    return response.data;
  },

  async getPost(postId) {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  async updatePost(postId, data) {
    const response = await api.put(`/posts/${postId}`, data);
    return response.data;
  },

  async deletePost(postId) {
    await api.delete(`/posts/${postId}`);
  }
};