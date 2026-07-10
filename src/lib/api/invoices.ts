/**
 * Invoices API Service
 */
import { api } from "./client";
import type { PaginatedResponse } from "./clients";

export interface Invoice {
  id: string;
  number: string;
  status: string;
  amount: number;
  currency: string;
  taxAmount: number;
  totalAmount: number;
  issueDate: string;
  dueDate?: string | null;
  paidDate?: string | null;
  notes?: string | null;
  clientId?: string | null;
  projectId?: string | null;
  quotationId?: string | null;
  createdAt: string;
  updatedAt: string;
  client?: { id: string; companyName: string; contactName: string; email: string };
}

export const invoicesApi = {
  list: (query: { page?: number; pageSize?: number; search?: string; status?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    return api.get<PaginatedResponse<Invoice>>(`/api/invoices?${params}`);
  },
  getById: (id: string) => api.get<Invoice>(`/api/invoices/${id}`),
  create: (data: Record<string, unknown>) => api.post<Invoice>("/api/invoices", data),
  update: (id: string, data: Record<string, unknown>) => api.put<Invoice>(`/api/invoices/${id}`, data),
  delete: (id: string) => api.delete<{ id: string }>(`/api/invoices/${id}`),
};
