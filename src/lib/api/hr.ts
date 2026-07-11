/**
 * HR API Service
 * --------------
 * Frontend API layer for the HR Dashboard. All HR-specific API calls.
 */
import { api } from "./client";
import type { PaginatedResponse } from "./clients";
import type { InternshipPosition, Application } from "./careers";

export interface HRStats {
  activeJobPosts: number;
  applicationsReceived: number;
  pendingResumeReviews: number;
  interviewsScheduled: number;
  offersSent: number;
  activeInterns: number;
  employees: number;
  trainingBatches: number;
  certificatesIssued: number;
}

export const hrApi = {
  // Dashboard
  getStats: () => api.get<HRStats>("/api/hr/stats"),

  // Jobs
  listJobs: (query: { page?: number; pageSize?: number; search?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    return api.get<PaginatedResponse<InternshipPosition>>(`/api/hr/jobs?${params}`);
  },
  getJob: (id: string) => api.get<InternshipPosition>(`/api/hr/jobs/${id}`),
  createJob: (data: Record<string, unknown>) => api.post<InternshipPosition>("/api/hr/jobs", data),
  updateJob: (id: string, data: Record<string, unknown>) => api.put<InternshipPosition>(`/api/hr/jobs/${id}`, data),
  deleteJob: (id: string) => api.delete<{ id: string }>(`/api/hr/jobs/${id}`),

  // Applications
  listApplications: (query: { page?: number; pageSize?: number; search?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    return api.get<PaginatedResponse<Application>>(`/api/hr/applications?${params}`);
  },
  getApplication: (id: string) => api.get<Application>(`/api/hr/applications/${id}`),
  updateApplicationStatus: (id: string, status: string) =>
    api.put<Application>(`/api/hr/applications/${id}`, { status }),
};
