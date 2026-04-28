import api from './api';

export const commentsService = {
  async getPostComments(postId, page = 1) {
    const response = await api.get(`/posts/${postId}/comments`, { params: { page } });
    return response.data;
  },

  async createComment(postId, body) {
    const response = await api.post(`/posts/${postId}/comments`, { body });
    return response.data;
  },

  async updateComment(commentId, body) {
    const response = await api.put(`/comments/${commentId}`, { body });
    return response.data;
  },

  async deleteComment(commentId) {
    await api.delete(`/comments/${commentId}`);
  }
};