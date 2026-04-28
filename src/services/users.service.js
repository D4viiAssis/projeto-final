import api from './api';

export const usersService = {
  async getProfile(username) {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/users/me', profileData);
    return response.data;
  },

  async uploadAvatar(avatarFile) {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    const response = await api.post('/users/me/avatar', formData);
    return response.data;
  },

  async searchUsers(query, perPage = 15) {
    const response = await api.get('/users/search', { params: { q: query, per_page: perPage } });
    return response.data;
  },

  async getSuggestions() {
    const response = await api.get('/users/suggestions');
    return response.data;
  },

  async getUserPosts(userId, page = 1) {
    const response = await api.get(`/users/${userId}/posts`, { params: { page } });
    return response.data;
  },

  async getFollowers(userId, page = 1) {
    const response = await api.get(`/users/${userId}/followers`, { params: { page } });
    return response.data;
  },

  async getFollowing(userId, page = 1) {
    const response = await api.get(`/users/${userId}/following`, { params: { page } });
    return response.data;
  },

  async checkIsFollowing(userId) {
    const response = await api.get(`/users/${userId}/is-following`);
    return response.data;
  },

  async followUser(userId) {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },
  async unfollowUser(userId) {
    await api.delete(`/users/${userId}/follow`);
  }
};