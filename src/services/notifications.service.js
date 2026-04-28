import api from './api';

export const notificationsService = {
  async getNotifications(page = 1) {
    const response = await api.get('/notifications', { params: { page } });
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  async markAsRead(notificationIds) {
    const response = await api.put('/notifications/read', { ids: notificationIds });
    return response.data;
  }
};