/**
 * Team Service
 * ------------
 * Business logic for team member management.
 * Note: Team members are stored as User records with DEVELOPER/PROJECT_MANAGER roles.
 */
import { db } from "@/lib/db";
import { ApiError } from "../utils/ApiError";
import type { PaginatedQuery, PaginatedResult } from "./ClientService";

export class TeamService {
  async list(query: PaginatedQuery): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize || 20));
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { email: { contains: query.search } },
      ];
    }
    if (query.status) {
      where.role = query.status;
    }

    const orderBy = { [query.sortBy || "createdAt"]: query.sortOrder || "desc" };

    const [data, total] = await Promise.all([
      db.user.findMany({
        skip,
        take: pageSize,
        where,
        orderBy,
        include: {
          _count: {
            select: {
              assignedProjects: true,
              managedProjects: true,
              assignedTasks: true,
            },
          },
        },
      }),
      db.user.count({ where }),
    ]);

    // Strip password hashes
    const safeData = data.map(({ passwordHash, ...rest }) => {
      void passwordHash;
      return rest;
    });

    return {
      data: safeData,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getById(id: string) {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        assignedProjects: { include: { client: true } },
        managedProjects: { include: { client: true } },
        assignedTasks: true,
      },
    });
    if (!user) throw ApiError.notFound("Team member not found");
    const { passwordHash, ...safe } = user;
    void passwordHash;
    return safe;
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash(data.password, 10);
    return db.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role as "SUPER_ADMIN" | "ADMIN" | "PROJECT_MANAGER" | "SALES" | "DEVELOPER" | "VIEWER",
      },
    });
  }

  async update(id: string, data: {
    name?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
  }) {
    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Team member not found");

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return db.user.update({ where: { id }, data: updateData });
  }

  async delete(id: string) {
    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Team member not found");
    await db.user.delete({ where: { id } });
    return { id };
  }
}

export const teamService = new TeamService();
