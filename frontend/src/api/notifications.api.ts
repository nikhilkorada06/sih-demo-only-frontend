import { apiClient } from './client';
import { Notification } from '../types/notification.types';

export const notificationsApi = {
  async list(): Promise<{ notifications: Notification[]; unreadCount: number }> {
    const { data } = await apiClient.get<{ notifications: Notification[]; unreadCount: number }>('/notifications');
    return data as { notifications: Notification[]; unreadCount: number };
  },
  async markRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },
  async markAllRead(): Promise<void> {
    await apiClient.patch('/notifications/read-all');
  }
};
