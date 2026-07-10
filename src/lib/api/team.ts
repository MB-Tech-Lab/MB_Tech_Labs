/**
 * Team API Service
 */
import { api } from "./client";
import type { PaginatedResponse } from "./clients";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    assignedProjects: number;
    managedProjects: number;
    assignedTasks: number;
  };
}

export const teamApi = {
  list: (query: { page?: number; pageSize?: number; search?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    return api.get<PaginatedResponse<TeamMember>>(`/api/team?${params}`);
  },
  getById: (id: string) => api.get<TeamMember>(`/api/team/${id}`),
  create: (data: { name: string; email: string; password: string; role: string }) =>
    api.post<TeamMember>("/api/team", data),
  update: (id: string, data: Partial<{ name: string; email: string; role: string; isActive: boolean }>) =>
    api.put<TeamMember>(`/api/team/${id}`, data),
  delete: (id: string) => api.delete<{ id: string }>(`/api/team/${id}`),
};
