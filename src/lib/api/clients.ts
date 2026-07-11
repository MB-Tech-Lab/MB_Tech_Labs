/**
 * Clients API Service
 */
import { api } from "./client";

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  industry?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  status: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    projects: number;
    submissions: number;
    invoices: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ClientQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

export const clientsApi = {
  list: (query: ClientQuery = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    });
    return api.get<PaginatedResponse<Client>>(`/api/clients?${params.toString()}`);
  },

  getById: (id: string) => api.get<Client>(`/api/clients/${id}`),

  create: (data: Partial<Client>) => api.post<Client>("/api/clients", data),

  update: (id: string, data: Partial<Client>) =>
    api.put<Client>(`/api/clients/${id}`, data),

  delete: (id: string) => api.delete<{ id: string }>(`/api/clients/${id}`),
};
