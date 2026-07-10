/**
 * Proposals API Service
 */
import { api } from "./client";
import type { PaginatedResponse } from "./clients";

export interface Proposal {
  id: string;
  title: string;
  status: string;
  sections: string; // JSON
  version: number;
  projectId?: string | null;
  submissionId?: string | null;
  authorId?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: { id: string; name: string; client?: { id: string; companyName: string } };
  submission?: { id: string; projectName: string };
  author?: { id: string; name: string; email: string };
}

export const proposalsApi = {
  list: (query: { page?: number; pageSize?: number; search?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    return api.get<PaginatedResponse<Proposal>>(`/api/proposals?${params}`);
  },
  getById: (id: string) => api.get<Proposal>(`/api/proposals/${id}`),
  create: (data: { title: string; sections?: Array<{ id: string; title: string; content: string }>; projectId?: string; submissionId?: string }) =>
    api.post<Proposal>("/api/proposals", data),
  update: (id: string, data: Partial<{ title: string; sections: Array<{ id: string; title: string; content: string }>; status: string }>) =>
    api.put<Proposal>(`/api/proposals/${id}`, data),
  delete: (id: string) => api.delete<{ id: string }>(`/api/proposals/${id}`),
};
