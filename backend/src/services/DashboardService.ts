/**
 * Dashboard Service
 * -----------------
 * Calculates real metrics from the database. Returns zeros if empty.
 */
import { prisma } from "../config/prisma";
import type { DashboardStats } from "../types";

export class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const [
      totalClients,
      activeProjects,
      pendingSRGs,
      pendingQuotations,
      revenueResult,
      pendingProposals,
      upcomingMeetings,
      newNotifications,
    ] = await Promise.all([
      prisma.client.count({ where: { status: "ACTIVE" } }),
      prisma.project.count({
        where: {
          status: { in: ["DISCOVERY", "PLANNING", "UI_UX", "DEVELOPMENT", "TESTING", "DEPLOYMENT"] },
        },
      }),
      prisma.sRGSubmission.count({
        where: { status: { in: ["NEW", "REVIEWING", "MEETING_SCHEDULED"] } },
      }),
      prisma.quotation.count({
        where: { status: { in: ["DRAFT", "SENT"] } },
      }),
      prisma.payment.aggregate({ _sum: { amount: true } }),
      prisma.proposal.count({
        where: { status: { in: ["DRAFT", "SENT"] } },
      }),
      prisma.meeting.count({
        where: {
          startTime: { gte: new Date() },
          status: "SCHEDULED",
        },
      }),
      prisma.notification.count({ where: { isRead: false } }),
    ]);

    return {
      totalClients,
      activeProjects,
      pendingSRGs,
      pendingQuotations,
      revenue: revenueResult._sum.amount || 0,
      pendingProposals,
      upcomingMeetings,
      newNotifications,
    };
  }

  async getRecentActivity(limit = 10) {
    const [submissions, projects, proposals, quotations, invoices] = await Promise.all([
      prisma.sRGSubmission.findMany({
        take: limit,
        orderBy: { submittedAt: "desc" },
        include: { client: true },
      }),
      prisma.project.findMany({
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: { client: true },
      }),
      prisma.proposal.findMany({
        take: limit,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.quotation.findMany({
        take: limit,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.invoice.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { client: true },
      }),
    ]);

    // Merge and sort by date
    const activities = [
      ...submissions.map((s) => ({
        type: "SRG_SUBMISSION",
        id: s.id,
        title: s.projectName,
        description: `${s.templateName} submission from ${s.client?.companyName || "Unknown"}`,
        timestamp: s.submittedAt,
        status: s.status,
      })),
      ...projects.map((p) => ({
        type: "PROJECT",
        id: p.id,
        title: p.name,
        description: `Project ${p.status.toLowerCase()} — ${p.client?.companyName || "No client"}`,
        timestamp: p.updatedAt,
        status: p.status,
      })),
      ...proposals.map((p) => ({
        type: "PROPOSAL",
        id: p.id,
        title: p.title,
        description: `Proposal ${p.status.toLowerCase()}`,
        timestamp: p.updatedAt,
        status: p.status,
      })),
      ...quotations.map((q) => ({
        type: "QUOTATION",
        id: q.id,
        title: q.title,
        description: `Quotation ${q.status.toLowerCase()} — $${q.totalAmount}`,
        timestamp: q.updatedAt,
        status: q.status,
      })),
      ...invoices.map((i) => ({
        type: "INVOICE",
        id: i.id,
        title: i.number,
        description: `Invoice ${i.status.toLowerCase()} — $${i.totalAmount}`,
        timestamp: i.createdAt,
        status: i.status,
      })),
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);

    return activities;
  }
}

export const dashboardService = new DashboardService();
