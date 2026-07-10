/**
 * Task Service
 * ------------
 * Business logic for task management with Kanban + List views.
 */
import { db } from "@/lib/db";
import { ApiError } from "../utils/ApiError";
import type { PaginatedQuery, PaginatedResult } from "./ClientService";

export class TaskService {
  async list(query: PaginatedQuery & { projectId?: string; assigneeId?: string }): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize || 100));
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.projectId) {
      where.projectId = query.projectId;
    }
    if (query.assigneeId) {
      where.assigneeId = query.assigneeId;
    }

    const orderBy = { [query.sortBy || "createdAt"]: query.sortOrder || "desc" };

    const [data, total] = await Promise.all([
      db.task.findMany({
        skip,
        take: pageSize,
        where,
        orderBy,
        include: {
          project: { include: { client: true } },
          assignee: true,
          createdBy: true,
        },
      }),
      db.task.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getById(id: string) {
    const task = await db.task.findUnique({
      where: { id },
      include: {
        project: { include: { client: true } },
        assignee: true,
        createdBy: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!task) throw ApiError.notFound("Task not found");
    return task;
  }

  async create(data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    estimatedHours?: number;
    dueDate?: string;
    projectId: string;
    assigneeId?: string;
  }, userId?: string) {
    return db.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || "TODO",
        priority: data.priority || "MEDIUM",
        estimatedHours: data.estimatedHours,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        projectId: data.projectId,
        ...(data.assigneeId ? { assigneeId: data.assigneeId } : {}),
        ...(userId ? { createdById: userId } : {}),
      },
      include: {
        project: { include: { client: true } },
        assignee: true,
      },
    });
  }

  async update(id: string, data: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    estimatedHours?: number;
    actualHours?: number;
    dueDate?: string;
    assigneeId?: string | null;
  }) {
    const existing = await db.task.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Task not found");

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.estimatedHours !== undefined) updateData.estimatedHours = data.estimatedHours;
    if (data.actualHours !== undefined) updateData.actualHours = data.actualHours;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    if (data.assigneeId !== undefined) {
      updateData.assigneeId = data.assigneeId || null;
    }

    return db.task.update({
      where: { id },
      data: updateData,
      include: {
        project: { include: { client: true } },
        assignee: true,
      },
    });
  }

  async delete(id: string) {
    const existing = await db.task.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Task not found");
    await db.task.delete({ where: { id } });
    return { id };
  }

  /**
   * Bulk update task statuses (for Kanban drag-and-drop).
   */
  async bulkUpdateStatus(updates: Array<{ id: string; status: string }>) {
    await Promise.all(
      updates.map((u) =>
        db.task.update({
          where: { id: u.id },
          data: { status: u.status },
        })
      )
    );
    return { updated: updates.length };
  }
}

export const taskService = new TaskService();
