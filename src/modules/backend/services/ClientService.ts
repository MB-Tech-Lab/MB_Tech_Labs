/**
 * Client Service
 * --------------
 * Business logic for client management. Framework-agnostic.
 */
import { db } from "@/lib/db";
import { ApiError } from "../utils/ApiError";

export interface PaginatedQuery {
  page?: number;
  pageSize?: number;
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

export class ClientService {
  async list(query: PaginatedQuery): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize || 20));
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.OR = [
        { companyName: { contains: query.search } },
        { contactName: { contains: query.search } },
        { email: { contains: query.search } },
      ];
    }
    if (query.status) {
      where.status = query.status;
    }

    const orderBy = { [query.sortBy || "createdAt"]: query.sortOrder || "desc" };

    const [data, total] = await Promise.all([
      db.client.findMany({
        skip,
        take: pageSize,
        where,
        orderBy,
        include: {
          _count: { select: { projects: true, submissions: true, invoices: true } },
        },
      }),
      db.client.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getById(id: string) {
    const client = await db.client.findUnique({
      where: { id },
      include: {
        projects: true,
        submissions: { orderBy: { submittedAt: "desc" } },
        invoices: { orderBy: { createdAt: "desc" } },
        documents: true,
        meetings: { orderBy: { startTime: "desc" } },
        comments: { include: { author: true }, orderBy: { createdAt: "desc" } },
        timeline: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!client) throw ApiError.notFound("Client not found");
    return client;
  }

  async create(data: {
    companyName: string;
    contactName: string;
    email: string;
    phone?: string;
    website?: string;
    industry?: string;
    address?: string;
    city?: string;
    country?: string;
    status?: string;
    notes?: string;
  }, userId?: string) {
    return db.client.create({
      data: {
        ...data,
        status: data.status || "ACTIVE",
        ...(userId ? { createdById: userId } : {}),
      },
    });
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await db.client.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Client not found");
    return db.client.update({ where: { id }, data });
  }

  async delete(id: string) {
    const existing = await db.client.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Client not found");
    await db.client.delete({ where: { id } });
    return { id };
  }
}

export const clientService = new ClientService();
