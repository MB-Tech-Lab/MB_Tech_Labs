/**
 * Notifications API Service
 */
import { api } from "./client";
import type { PaginatedResponse } from "./clients";

export interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  isRead: boolean;
  userId?: string | null;
  submissionId?: string | null;
  projectId?: string | null;
  clientId?: string | null;
  createdAt: string;
}

export const notificationsApi = {
  list: (query: { page?: number; pageSize?: number; status?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    return api.get<PaginatedResponse<Notification>>(`/api/notifications?${params}`);
  },
  markAsRead: (id: string) => api.patch<Notification>(`/api/notifications/${id}`, {}),
  markAllAsRead: () => api.patch<{ updated: number }>(`/api/notifications`, {}),
  delete: (id: string) => api.delete<{ id: string }>(`/api/notifications/${id}`),
};
