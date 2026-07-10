/**
 * Project Repository
 */
import { prisma } from "../config/prisma";
import type { Prisma } from "@prisma/client";

export class ProjectRepository {
  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProjectWhereInput;
    orderBy?: Prisma.ProjectOrderByWithRelationInput;
  }) {
    return prisma.project.findMany({
      ...params,
      include: {
        client: true,
        projectManager: true,
        assignedDevelopers: true,
        stages: { orderBy: { order: "asc" } },
        _count: { select: { tasks: true, milestones: true, documents: true } },
      },
    });
  }

  async count(where?: Prisma.ProjectWhereInput): Promise<number> {
    return prisma.project.count({ where });
  }

  async findById(id: string) {
    return prisma.project.findUnique({
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
        _count: { select: { tasks: true } },
      },
    });
  }

  async create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({ data });
  }

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  }
}

export const projectRepository = new ProjectRepository();
