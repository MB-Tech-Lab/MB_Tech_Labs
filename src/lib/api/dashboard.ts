/**
 * Dashboard API Service
 * ---------------------
 * Fetches real metrics from the backend.
 */
import { api } from "./client";

export interface DashboardStats {
  totalClients: number;
  activeProjects: number;
  pendingSRGs: number;
  pendingQuotations: number;
  revenue: number;
  pendingProposals: number;
  upcomingMeetings: number;
  newNotifications: number;
}

export interface ActivityItem {
  type: string;
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>("/api/dashboard"),

  getRecentActivity: (limit = 10) =>
    api.get<ActivityItem[]>(`/api/dashboard/activity?limit=${limit}`),
};
