/**
 * Shared API Types
 * ----------------
 * Used by controllers, services, and the frontend API layer.
 */
import type { Role } from "@prisma/client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string | null;
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: Role;
  name: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedQuery {
  page?: string;
  pageSize?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

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

export interface AnalyticsData {
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  projectsByStatus: Array<{ status: string; count: number }>;
  leadConversion: { total: number; approved: number; rate: number };
  projectTypes: Array<{ type: string; count: number }>;
  industryDistribution: Array<{ industry: string; count: number }>;
}
