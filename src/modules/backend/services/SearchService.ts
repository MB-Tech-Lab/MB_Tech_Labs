/**
 * Global Search Service
 * ---------------------
 * Searches across all entities: clients, projects, SRGs, team,
 * meetings, tasks, proposals, quotations.
 */
import { db } from "@/lib/db";

export interface SearchResult {
  type: "client" | "project" | "srg" | "team" | "meeting" | "task" | "proposal" | "quotation";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  status?: string;
}

export class SearchService {
  async search(query: string, limit = 20): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    const q = query.trim();
    const perType = Math.ceil(limit / 8);

    const [clients, projects, srgs, users, meetings, tasks, proposals, quotations] = await Promise.all([
      db.client.findMany({
        where: {
          OR: [
            { companyName: { contains: q } },
            { contactName: { contains: q } },
            { email: { contains: q } },
          ],
        },
        take: perType,
        orderBy: { createdAt: "desc" },
      }),
      db.project.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: perType,
        orderBy: { updatedAt: "desc" },
        include: { client: true },
      }),
      db.sRGSubmission.findMany({
        where: {
          OR: [
            { projectName: { contains: q } },
            { templateName: { contains: q } },
            { sessionId: { contains: q } },
          ],
        },
        take: perType,
        orderBy: { submittedAt: "desc" },
        include: { client: true },
      }),
      db.user.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
          ],
        },
        take: perType,
        orderBy: { createdAt: "desc" },
      }),
      db.meeting.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: perType,
        orderBy: { startTime: "desc" },
      }),
      db.task.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        },
        take: perType,
        orderBy: { createdAt: "desc" },
        include: { project: true },
      }),
      db.proposal.findMany({
        where: { title: { contains: q } },
        take: perType,
        orderBy: { updatedAt: "desc" },
      }),
      db.quotation.findMany({
        where: { title: { contains: q } },
        take: perType,
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const results: SearchResult[] = [];

    clients.forEach((c) =>
      results.push({
        type: "client",
        id: c.id,
        title: c.companyName,
        subtitle: `${c.contactName} · ${c.email}`,
        href: `/admin/clients/${c.id}`,
        status: c.status,
      })
    );

    projects.forEach((p) =>
      results.push({
        type: "project",
        id: p.id,
        title: p.name,
        subtitle: `${p.client?.companyName || "No client"} · ${p.status}`,
        href: `/admin/projects/${p.id}`,
        status: p.status,
      })
    );

    srgs.forEach((s) =>
      results.push({
        type: "srg",
        id: s.id,
        title: s.projectName,
        subtitle: `${s.client?.companyName || "Unknown"} · ${s.templateName}`,
        href: `/admin/submissions/${s.id}`,
        status: s.status,
      })
    );

    users.forEach((u) =>
      results.push({
        type: "team",
        id: u.id,
        title: u.name,
        subtitle: `${u.email} · ${u.role.replace("_", " ")}`,
        href: `/admin/team`,
      })
    );

    meetings.forEach((m) =>
      results.push({
        type: "meeting",
        id: m.id,
        title: m.title,
        subtitle: `${new Date(m.startTime).toLocaleDateString()} · ${m.status}`,
        href: `/admin/calendar`,
        status: m.status,
      })
    );

    tasks.forEach((t) =>
      results.push({
        type: "task",
        id: t.id,
        title: t.title,
        subtitle: `${t.project?.name || "No project"} · ${t.status}`,
        href: `/admin/projects/${t.projectId}`,
        status: t.status,
      })
    );

    proposals.forEach((p) =>
      results.push({
        type: "proposal",
        id: p.id,
        title: p.title,
        subtitle: `${p.status} · v${p.version}`,
        href: `/admin/proposals`,
        status: p.status,
      })
    );

    quotations.forEach((q) =>
      results.push({
        type: "quotation",
        id: q.id,
        title: q.title,
        subtitle: `${q.status} · $${q.totalAmount}`,
        href: `/admin/quotations`,
        status: q.status,
      })
    );

    return results.slice(0, limit);
  }
}

export const searchService = new SearchService();
