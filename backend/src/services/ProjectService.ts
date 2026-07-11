/**
 * Project Service
 */
import { projectRepository } from "../repositories/ProjectRepository";
import { ApiError } from "../utils/ApiError";
import type { PaginatedResult, PaginatedQuery } from "../types";
import type { Project, Prisma } from "@prisma/client";

const DEV_STAGES = ["Discovery", "Planning", "UI/UX", "Development", "Testing", "Deployment", "Maintenance"];

export class ProjectService {
  async list(query: PaginatedQuery): Promise<PaginatedResult<Project>> {
    const page = Math.max(1, parseInt(query.page || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize || "20", 10)));
    const skip = (page - 1) * pageSize;

    const where: Prisma.ProjectWhereInput = {};
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
      projectRepository.findMany({ skip, take: pageSize, where, orderBy }),
      projectRepository.count(where),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getById(id: string) {
    const project = await projectRepository.findById(id);
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

    const project = await projectRepository.create({
      name: input.name,
      slug,
      description: input.description,
      status: (input.status as Project["status"]) || "DISCOVERY",
      priority: (input.priority as Project["priority"]) || "MEDIUM",
      currentStage: input.currentStage || "Discovery",
      progress: input.progress || 0,
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      estimatedHours: input.estimatedHours,
      budget: input.budget,
      technologyStack: input.technologyStack ? JSON.stringify(input.technologyStack) : null,
      notes: input.notes,
      client: { connect: { id: input.clientId } },
      ...(userId ? { createdBy: { connect: { id: userId } } } : {}),
    });

    // Create default stages
    await Promise.all(
      DEV_STAGES.map((name, idx) =>
        // @ts-expect-error prisma client typing
        prismaProjectStageCreate(project.id, name, idx)
      )
    );

    return project;
  }

  async update(id: string, input: {
    name?: string;
    description?: string;
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
    projectManagerId?: string | null;
    assignedDeveloperIds?: string[];
  }) {
    const existing = await projectRepository.findById(id);
    if (!existing) throw ApiError.notFound("Project not found");

    const data: Prisma.ProjectUpdateInput = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description;
    if (input.status !== undefined) data.status = input.status as Project["status"];
    if (input.priority !== undefined) data.priority = input.priority as Project["priority"];
    if (input.currentStage !== undefined) data.currentStage = input.currentStage;
    if (input.progress !== undefined) data.progress = input.progress;
    if (input.startDate !== undefined) data.startDate = input.startDate ? new Date(input.startDate) : null;
    if (input.endDate !== undefined) data.endDate = input.endDate ? new Date(input.endDate) : null;
    if (input.estimatedHours !== undefined) data.estimatedHours = input.estimatedHours;
    if (input.budget !== undefined) data.budget = input.budget;
    if (input.technologyStack !== undefined) data.technologyStack = JSON.stringify(input.technologyStack);
    if (input.notes !== undefined) data.notes = input.notes;
    if (input.projectManagerId !== undefined) {
      data.projectManager = input.projectManagerId ? { connect: { id: input.projectManagerId } } : { disconnect: true };
    }
    if (input.assignedDeveloperIds !== undefined) {
      data.assignedDevelopers = { set: input.assignedDeveloperIds.map((id) => ({ id })) };
    }

    return projectRepository.update(id, data);
  }

  async delete(id: string) {
    const existing = await projectRepository.findById(id);
    if (!existing) throw ApiError.notFound("Project not found");
    await projectRepository.delete(id);
    return { id };
  }
}

// helper to create project stage
import { prisma } from "../config/prisma";
function prismaProjectStageCreate(projectId: string, name: string, order: number) {
  return prisma.projectStage.create({
    data: { projectId, name, order },
  });
}

export const projectService = new ProjectService();
