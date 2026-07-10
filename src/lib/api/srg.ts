/**
 * SRG API Service
 * ---------------
 * Software Requirement Gathering submissions.
 * POST is public (clients submit from /start-project).
 * GET/PUT/DELETE are admin-only.
 */
import { api } from "./client";
import type { PaginatedResponse } from "./clients";

export interface SRGSubmission {
  id: string;
  sessionId: string;
  templateId: string;
  templateName: string;
  projectType: string;
  projectName: string;
  status: string;
  priority: string;
  clientId?: string | null;
  projectId?: string | null;
  payload: string; // JSON
  internalNotes?: string | null;
  submittedAt: string;
  updatedAt: string;
  client?: {
    id: string;
    companyName: string;
    contactName: string;
    email: string;
  } | null;
  answers?: Array<{
    id: string;
    questionId: string;
    questionLabel: string;
    questionType: string;
    sectionId?: string | null;
    sectionTitle?: string | null;
    value: string;
  }>;
  uploads?: Array<{
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    category?: string | null;
  }>;
  timeline?: Array<{
    id: string;
    eventType: string;
    title: string;
    description?: string | null;
    createdAt: string;
  }>;
  _count?: {
    uploads: number;
    proposals: number;
    quotations: number;
  };
}

export interface SRGSubmitPayload {
  sessionId: string;
  templateId: string;
  templateName: string;
  projectType: string;
  projectName: string;
  clientInfo: {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    jobTitle?: string;
    country: string;
    timezone: string;
    preferredContact: string;
  };
  businessInfo?: Record<string, unknown>;
  projectGoals?: Record<string, unknown>;
  answers?: Record<string, unknown>;
  srgSections?: Array<{
    id: string;
    title: string;
    questions: Array<{
      id: string;
      label: string;
      type: string;
      answer: unknown;
    }>;
  }>;
  workflow?: Record<string, unknown>;
  teamRequirements?: { roles?: string[]; permissions?: string[] };
  uploads?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    category: string;
  }>;
}

export const srgApi = {
  list: (query: { page?: number; pageSize?: number; search?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    });
    return api.get<PaginatedResponse<SRGSubmission>>(`/api/srg?${params.toString()}`);
  },

  getById: (id: string) => api.get<SRGSubmission>(`/api/srg/${id}`),

  /** Public — called from /start-project */
  submit: (payload: SRGSubmitPayload) =>
    api.post<SRGSubmission>("/api/srg", payload),

  update: (id: string, data: { status?: string; priority?: string; internalNotes?: string }) =>
    api.put<SRGSubmission>(`/api/srg/${id}`, data),

  delete: (id: string) => api.delete<{ id: string }>(`/api/srg/${id}`),
};
