/**
 * Projects API Service
 */
import { api } from "./client";
import type { PaginatedResponse } from "./clients";

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: string;
  priority: string;
  currentStage: string;
  progress: number;
  startDate?: string | null;
  endDate?: string | null;
  estimatedHours?: number | null;
  budget?: number | null;
  technologyStack?: string | null;
  notes?: string | null;
  clientId: string;
  projectManagerId?: string | null;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    companyName: string;
    contactName: string;
    email: string;
  };
  projectManager?: {
    id: string;
    name: string;
    email: string;
  } | null;
  assignedDevelopers?: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  stages?: Array<{
    id: string;
    name: string;
    order: number;
    status: string;
  }>;
  _count?: {
    tasks: number;
    milestones: number;
    documents: number;
  };
}

export const projectsApi = {
  list: (query: { page?: number; pageSize?: number; search?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    });
    return api.get<PaginatedResponse<Project>>(`/api/projects?${params.toString()}`);
  },

  getById: (id: string) => api.get<Project>(`/api/projects/${id}`),

  create: (data: {
    name: string;
    description?: string;
    clientId: string;
    status?: string;
    priority?: string;
    budget?: number;
    technologyStack?: string[];
    notes?: string;
  }) => api.post<Project>("/api/projects", data),

  update: (id: string, data: Partial<Project>) =>
    api.put<Project>(`/api/projects/${id}`, data),

  delete: (id: string) => api.delete<{ id: string }>(`/api/projects/${id}`),
};
