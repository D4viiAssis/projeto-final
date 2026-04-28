import api from './api';

export const followsService = {
  async getFollowing(userId) {
    const response = await api.get(`/users/${userId}/following`);
    return response.data;
  },

  async followUser(userId) {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  async unfollowUser(userId) {
    await api.delete(`/users/${userId}/follow`);
  },

  async getFollowers(userId, page = 1) {
    const response = await api.get(`/users/${userId}/followers`, { params: { page } });
    return response.data;
  },

  async getFollowingList(userId, page = 1) {
    const response = await api.get(`/users/${userId}/following`, { params: { page } });
    return response.data;
  },

  async checkIsFollowing(userId) {
    const response = await api.get(`/users/${userId}/is-following`);
    return response.data;
  }
};