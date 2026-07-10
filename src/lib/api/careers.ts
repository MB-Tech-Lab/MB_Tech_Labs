/**
 * Careers API Service
 */
import { api } from "./client";
import type { PaginatedResponse } from "./clients";

export interface InternshipPosition {
  id: string;
  title: string;
  slug: string;
  department: string;
  technology?: string | null;
  duration: string;
  stipend?: string | null;
  mode: string;
  location?: string | null;
  openings: number;
  status: string;
  description: string;
  responsibilities?: string | null;
  skillsRequired?: string | null;
  eligibility?: string | null;
  techStack?: string | null;
  benefits?: string | null;
  learningOutcome?: string | null;
  selectionProcess?: string | null;
  applicationDeadline?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { applications: number };
}

export interface Application {
  id: string;
  status: string;
  scoreProgramming: number;
  scoreProjects: number;
  scoreHackathons: number;
  scoreGithub: number;
  scoreCommunication: number;
  scoreAttitude: number;
  totalScore: number;
  appliedAt: string;
  updatedAt: string;
  candidate?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    city?: string | null;
    country?: string | null;
    college?: string | null;
    degree?: string | null;
    branch?: string | null;
    cgpa?: number | null;
    graduationYear?: number | null;
    skills?: string | null;
    githubProfile?: string | null;
    linkedinProfile?: string | null;
    portfolioWebsite?: string | null;
    resumePath?: string | null;
    whyJoin?: string | null;
    projects?: Array<{ id: string; name: string; description?: string; technology?: string; githubUrl?: string; liveDemoUrl?: string }>;
    hackathons?: Array<{ id: string; name: string; year?: number; rank?: string }>;
  };
  position?: InternshipPosition;
}

export interface TalentStats {
  openPositions: number;
  newApplications: number;
  pendingReviews: number;
  interviewsScheduled: number;
  internsInTraining: number;
  certificatesIssued: number;
  convertedEmployees: number;
}

export const careersApi = {
  // Public
  listPositions: (query: { search?: string; department?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { if (v) params.set(k, v); });
    return api.get<InternshipPosition[]>(`/api/careers/positions?${params}`);
  },
  getPosition: (id: string) => api.get<InternshipPosition>(`/api/careers/positions/${id}`),
  submitApplication: (data: Record<string, unknown>) =>
    api.post<{ application: Application; candidate: unknown }>("/api/careers/applications", data),

  // Admin
  listApplications: (query: { page?: number; pageSize?: number; search?: string; status?: string; positionId?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    return api.get<PaginatedResponse<Application>>(`/api/careers/applications?${params}`);
  },
  getApplication: (id: string) => api.get<Application>(`/api/careers/applications/${id}`),
  updateApplication: (id: string, data: Record<string, unknown>) =>
    api.put<Application>(`/api/careers/applications/${id}`, data),
  deleteApplication: (id: string) => api.delete<{ id: string }>(`/api/careers/applications/${id}`),
  getStats: () => api.get<TalentStats>("/api/careers/stats"),

  // Admin position management
  createPosition: (data: Record<string, unknown>) => api.post<InternshipPosition>("/api/careers/positions", data),
  updatePosition: (id: string, data: Record<string, unknown>) => api.put<InternshipPosition>(`/api/careers/positions/${id}`, data),
  deletePosition: (id: string) => api.delete<{ id: string }>(`/api/careers/positions/${id}`),
};
