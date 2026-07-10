/**
 * Quotations API Service
 */
import { api } from "./client";
import type { PaginatedResponse } from "./clients";

export interface Quotation {
  id: string;
  title: string;
  status: string;
  items: string; // JSON
  currency: string;
  taxRate: number;
  discount: number;
  paymentTerms?: string | null;
  validUntil?: string | null;
  notes?: string | null;
  totalAmount: number;
  projectId?: string | null;
  submissionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const quotationsApi = {
  list: (query: { page?: number; pageSize?: number; search?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    return api.get<PaginatedResponse<Quotation>>(`/api/quotations?${params}`);
  },
  getById: (id: string) => api.get<Quotation>(`/api/quotations/${id}`),
  create: (data: Record<string, unknown>) => api.post<Quotation>("/api/quotations", data),
  update: (id: string, data: Record<string, unknown>) => api.put<Quotation>(`/api/quotations/${id}`, data),
  delete: (id: string) => api.delete<{ id: string }>(`/api/quotations/${id}`),
};
