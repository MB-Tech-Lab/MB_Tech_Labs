/**
 * Meetings API Service
 */
import { api } from "./client";
import type { PaginatedResponse } from "./clients";

export interface Meeting {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  status: string;
  startTime: string;
  endTime?: string | null;
  location?: string | null;
  meetingUrl?: string | null;
  projectId?: string | null;
  clientId?: string | null;
  organizerId?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: { id: string; name: string; client?: { id: string; companyName: string } };
  client?: { id: string; companyName: string };
  organizer?: { id: string; name: string; email: string };
}

export const meetingsApi = {
  list: (query: { page?: number; pageSize?: number; search?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    return api.get<PaginatedResponse<Meeting>>(`/api/meetings?${params}`);
  },
  getById: (id: string) => api.get<Meeting>(`/api/meetings/${id}`),
  create: (data: Record<string, unknown>) => api.post<Meeting>("/api/meetings", data),
  update: (id: string, data: Record<string, unknown>) => api.put<Meeting>(`/api/meetings/${id}`, data),
  delete: (id: string) => api.delete<{ id: string }>(`/api/meetings/${id}`),
};
