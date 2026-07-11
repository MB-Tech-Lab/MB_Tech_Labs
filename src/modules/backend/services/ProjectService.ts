/**
 * Project Service
 * ---------------
 * Business logic for project management.
 */
import { db } from "@/lib/db";
import { ApiError } from "../utils/ApiError";
import type { PaginatedQuery, PaginatedResult } from "./ClientService";

const DEV_STAGES = ["Discovery", "Planning", "UI/UX", "Development", "Testing", "Deployment", "Maintenance"];

export class ProjectService {
  async list(query: PaginatedQuery): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize || 20));
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }
    if (query.status) {
      where.status = query.status;
    }

    const orderBy = { [query.sortBy || "createdAt"]: query.sortOrder || "desc" };

    const [data, total] = await Promise.all([
      db.project.findMany({
        skip,
        take: pageSize,
        where,
        orderBy,
        include: {
          client: true,
          projectManager: true,
          assignedDevelopers: true,
          stages: { orderBy: { order: "asc" } },
          _count: { select: { tasks: true, milestones: true, documents: true } },
        },
      }),
      db.project.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getById(id: string) {
    const project = await db.project.findUnique({
      where: { id },
      include: {
        client: true,
        projectManager: true,
        assignedDevelopers: true,
        stages: { orderBy: { order: "asc" } },
        tasks: { include: { assignee: true }, orderBy: { createdAt: "desc" } },
        milestones: { orderBy: { dueDate: "asc" } },
        documents: true,
        comments: { include: { author: true }, orderBy: { createdAt: "desc" } },
        timeline: { orderBy: { createdAt: "desc" } },
        proposals: true,
        quotations: true,
      },
    });
    if (!project) throw ApiError.notFound("Project not found");
    return project;
  }

  async create(input: {
    name: string;
    description?: string;
    clientId: string;
    status?: string;
    priority?: string;
    currentStage?: string;
    progress?: number;
    startDate?: string;
    endDate?: string;
    estimatedHours?: number;
    budget?: number;
    technologyStack?: string[];
    notes?: string;
  }, userId?: string) {
    const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);

    const project = await db.project.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        status: (input.status as string) || "DISCOVERY",
        priority: (input.priority as string) || "MEDIUM",
        currentStage: input.currentStage || "Discovery",
        progress: input.progress || 0,
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
        estimatedHours: input.estimatedHours,
        budget: input.budget,
        technologyStack: input.technologyStack ? JSON.stringify(input.technologyStack) : null,
        notes: input.notes,
        clientId: input.clientId,
        ...(userId ? { createdById: userId } : {}),
      },
    });

    // Create default stages
    await Promise.all(
      DEV_STAGES.map((name, idx) =>
        db.projectStage.create({
          data: { projectId: project.id, name, order: idx },
        })
      )
    );

    return project;
  }

  async update(id: string, input: Record<string, unknown>) {
    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Project not found");

    const data: Record<string, unknown> = {};
    const allowed = ["name", "description", "status", "priority", "currentStage", "progress", "estimatedHours", "budget", "notes"];
    for (const key of allowed) {
      if (input[key] !== undefined) data[key] = input[key];
    }
    if (input.startDate !== undefined) data.startDate = input.startDate ? new Date(input.startDate as string) : null;
    if (input.endDate !== undefined) data.endDate = input.endDate ? new Date(input.endDate as string) : null;
    if (input.technologyStack !== undefined) data.technologyStack = JSON.stringify(input.technologyStack);
    if (input.projectManagerId !== undefined) {
      data.projectManagerId = input.projectManagerId || null;
    }
    if (input.assignedDeveloperIds !== undefined) {
      // For many-to-many, we need to use the Prisma connect/disconnect syntax
      // This is simplified — in production you'd diff the arrays
      data.assignedDevelopers = {
        set: (input.assignedDeveloperIds as string[]).map((id) => ({ id })),
      };
    }

    return db.project.update({ where: { id }, data });
  }

  async delete(id: string) {
    const existing = await db.project.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Project not found");
    await db.project.delete({ where: { id } });
    return { id };
  }
}

export const projectService = new ProjectService();
