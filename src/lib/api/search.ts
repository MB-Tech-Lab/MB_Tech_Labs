/**
 * Search API Service
 */
import { api } from "./client";

export interface SearchResult {
  type: "client" | "project" | "srg" | "team" | "meeting" | "task" | "proposal" | "quotation";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  status?: string;
}

export const searchApi = {
  search: (query: string, limit = 20) =>
    api.get<SearchResult[]>(`/api/search?q=${encodeURIComponent(query)}&limit=${limit}`),
};
