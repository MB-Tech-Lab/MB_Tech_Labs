/**
 * Analytics API Service
 */
import { api } from "./client";

export interface AnalyticsData {
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  projectsByStatus: Array<{ status: string; count: number }>;
  leadConversion: { total: number; approved: number; rate: number };
  projectTypes: Array<{ type: string; count: number }>;
  industryDistribution: Array<{ industry: string; count: number }>;
}

export const analyticsApi = {
  get: () => api.get<AnalyticsData>("/api/analytics"),
};
