/**
 * Files API Service
 */
import { api, tokenStorage } from "./client";

export interface FileDocument {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  category?: string | null;
  entityType: string;
  entityId: string;
  uploadedById?: string | null;
  createdAt: string;
  uploadedBy?: { id: string; name: string; email: string };
}

export const filesApi = {
  list: (query: { entityType?: string; entityId?: string; category?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    return api.get<FileDocument[]>(`/api/files?${params}`);
  },

  getById: (id: string) => api.get<FileDocument>(`/api/files/${id}`),

  upload: async (file: File, entityType: string, entityId: string, category?: string): Promise<FileDocument> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("entityType", entityType);
    formData.append("entityId", entityId);
    if (category) formData.append("category", category);

    const token = tokenStorage.get();
    const res = await fetch("/api/files", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || "Upload failed");
    }
    return json.data as FileDocument;
  },

  getDownloadUrl: (id: string) => `/api/files/${id}?download=true`,

  delete: (id: string) => api.delete<{ id: string }>(`/api/files/${id}`),
};
