/**
 * Analytics Service
 * -----------------
 * Real SQL-based analytics. Returns zeros when no data exists.
 */
import { db } from "@/lib/db";

export interface AnalyticsData {
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  projectsByStatus: Array<{ status: string; count: number }>;
  leadConversion: { total: number; approved: number; rate: number };
  projectTypes: Array<{ type: string; count: number }>;
  industryDistribution: Array<{ industry: string; count: number }>;
}

export class AnalyticsService {
  async getAnalytics(): Promise<AnalyticsData> {
    const [monthlyRevenue, projectsByStatus, leadConversion, projectTypes, industryDistribution] =
      await Promise.all([
        this.getMonthlyRevenue(),
        this.getProjectsByStatus(),
        this.getLeadConversion(),
        this.getProjectTypes(),
        this.getIndustryDistribution(),
      ]);

    return {
      monthlyRevenue,
      projectsByStatus,
      leadConversion,
      projectTypes,
      industryDistribution,
    };
  }

  /**
   * Monthly revenue from paid invoices (last 12 months).
   * Returns zeros for months with no payments.
   */
  private async getMonthlyRevenue() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const payments = await db.payment.findMany({
      where: { paidAt: { gte: twelveMonthsAgo } },
      select: { amount: true, paidAt: true },
    });

    // Group by month
    const monthMap = new Map<string, number>();
    for (let i = 0; i < 12; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthMap.set(key, 0);
    }

    payments.forEach((p) => {
      const d = new Date(p.paidAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const current = monthMap.get(key) || 0;
      monthMap.set(key, current + p.amount);
    });

    return Array.from(monthMap.entries())
      .map(([month, revenue]) => {
        const [year, mon] = month.split("-");
        const date = new Date(parseInt(year), parseInt(mon) - 1);
        return {
          month: date.toLocaleDateString("en-US", { month: "short" }),
          revenue,
        };
      })
      .reverse();
  }

  /**
   * Count of projects grouped by status.
   */
  private async getProjectsByStatus() {
    const projects = await db.project.groupBy({
      by: ["status"],
      _count: { status: true },
    });
    return projects.map((p) => ({
      status: p.status,
      count: p._count.status,
    }));
  }

  /**
   * Lead conversion: total SRG submissions vs approved.
   */
  private async getLeadConversion() {
    const [total, approved] = await Promise.all([
      db.sRGSubmission.count(),
      db.sRGSubmission.count({ where: { status: "APPROVED" } }),
    ]);
    return {
      total,
      approved,
      rate: total > 0 ? Math.round((approved / total) * 100) : 0,
    };
  }

  /**
   * Project types (template names) from SRG submissions.
   */
  private async getProjectTypes() {
    const submissions = await db.sRGSubmission.groupBy({
      by: ["templateName"],
      _count: { templateName: true },
    });
    return submissions.map((s) => ({
      type: s.templateName,
      count: s._count.templateName,
    }));
  }

  /**
   * Industry distribution from clients.
   */
  private async getIndustryDistribution() {
    const clients = await db.client.groupBy({
      by: ["industry"],
      _count: { industry: true },
    });
    return clients
      .filter((c) => c.industry !== null)
      .map((c) => ({
        industry: c.industry || "Unknown",
        count: c._count.industry,
      }));
  }
}

export const analyticsService = new AnalyticsService();
