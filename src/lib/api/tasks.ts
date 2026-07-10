/**
 * Tasks API Service
 */
import { api } from "./client";
import type { PaginatedResponse } from "./clients";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  estimatedHours?: number | null;
  actualHours: number;
  dueDate?: string | null;
  projectId: string;
  assigneeId?: string | null;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: { id: string; name: string; client?: { id: string; companyName: string } };
  assignee?: { id: string; name: string; email: string };
}

export const tasksApi = {
  list: (query: { page?: number; pageSize?: number; search?: string; status?: string; projectId?: string; assigneeId?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    return api.get<PaginatedResponse<Task>>(`/api/tasks?${params}`);
  },
  getById: (id: string) => api.get<Task>(`/api/tasks/${id}`),
  create: (data: { title: string; description?: string; status?: string; priority?: string; estimatedHours?: number; dueDate?: string; projectId: string; assigneeId?: string }) =>
    api.post<Task>("/api/tasks", data),
  update: (id: string, data: Partial<Task>) => api.put<Task>(`/api/tasks/${id}`, data),
  delete: (id: string) => api.delete<{ id: string }>(`/api/tasks/${id}`),
};
