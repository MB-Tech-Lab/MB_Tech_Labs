/**
 * Internship Position Service
 * ---------------------------
 * CRUD for internship job openings.
 */
import { db } from "@/lib/db";
import { ApiError } from "../utils/ApiError";
import type { PaginatedQuery, PaginatedResult } from "./ClientService";

export class InternshipPositionService {
  async list(query: PaginatedQuery & { status?: string; department?: string }): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize || 20));
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.department) where.department = query.department;

    const orderBy = { [query.sortBy || "createdAt"]: query.sortOrder || "desc" };

    const [data, total] = await Promise.all([
      db.internshipPosition.findMany({
        skip, take: pageSize, where, orderBy,
        include: { _count: { select: { applications: true } } },
      }),
      db.internshipPosition.count({ where }),
    ]);

    return { data, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  /** Public list — only PUBLISHED positions */
  async listPublic(query: { search?: string; department?: string }): Promise<unknown[]> {
    const where: Record<string, unknown> = { status: "PUBLISHED" };
    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }
    if (query.department) where.department = query.department;

    return db.internshipPosition.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } },
    });
  }

  async getById(id: string) {
    const pos = await db.internshipPosition.findUnique({
      where: { id },
      include: { _count: { select: { applications: true } }, createdBy: true },
    });
    if (!pos) throw ApiError.notFound("Position not found");
    return pos;
  }

  async getBySlug(slug: string) {
    const pos = await db.internshipPosition.findUnique({
      where: { slug },
      include: { _count: { select: { applications: true } } },
    });
    if (!pos) throw ApiError.notFound("Position not found");
    return pos;
  }

  async create(data: {
    title: string;
    department: string;
    technology?: string;
    duration: string;
    stipend?: string;
    mode?: string;
    location?: string;
    openings?: number;
    description: string;
    responsibilities?: string[];
    skillsRequired?: string[];
    eligibility?: string[];
    techStack?: string[];
    benefits?: string[];
    learningOutcome?: string;
    selectionProcess?: string[];
    applicationDeadline?: string;
  }, userId?: string) {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
    return db.internshipPosition.create({
      data: {
        title: data.title,
        slug,
        department: data.department,
        technology: data.technology,
        duration: data.duration,
        stipend: data.stipend,
        mode: data.mode || "REMOTE",
        location: data.location,
        openings: data.openings || 1,
        status: "DRAFT",
        description: data.description,
        responsibilities: data.responsibilities ? JSON.stringify(data.responsibilities) : null,
        skillsRequired: data.skillsRequired ? JSON.stringify(data.skillsRequired) : null,
        eligibility: data.eligibility ? JSON.stringify(data.eligibility) : null,
        techStack: data.techStack ? JSON.stringify(data.techStack) : null,
        benefits: data.benefits ? JSON.stringify(data.benefits) : null,
        learningOutcome: data.learningOutcome,
        selectionProcess: data.selectionProcess ? JSON.stringify(data.selectionProcess) : null,
        applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : null,
        ...(userId ? { createdById: userId } : {}),
      },
    });
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await db.internshipPosition.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Position not found");

    const updateData: Record<string, unknown> = {};
    const simple = ["title", "department", "technology", "duration", "stipend", "mode", "location", "openings", "status", "description", "learningOutcome"];
    for (const k of simple) {
      if (data[k] !== undefined) updateData[k] = data[k];
    }
    const jsonFields = ["responsibilities", "skillsRequired", "eligibility", "techStack", "benefits", "selectionProcess"];
    for (const k of jsonFields) {
      if (data[k] !== undefined) updateData[k] = Array.isArray(data[k]) ? JSON.stringify(data[k]) : data[k];
    }
    if (data.applicationDeadline !== undefined) {
      updateData.applicationDeadline = data.applicationDeadline ? new Date(data.applicationDeadline as string) : null;
    }

    return db.internshipPosition.update({ where: { id }, data: updateData });
  }

  async delete(id: string) {
    const existing = await db.internshipPosition.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Position not found");
    await db.internshipPosition.delete({ where: { id } });
    return { id };
  }
}

export const positionService = new InternshipPositionService();
