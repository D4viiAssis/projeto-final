import api from './api';

export const feedService = {
  async getFeed(cursor = null) {
    const params = cursor ? { cursor } : {};
    const response = await api.get('/feed', { params });
    return response.data;
  }
};