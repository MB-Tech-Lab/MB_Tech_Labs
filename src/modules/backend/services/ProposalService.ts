/**
 * Proposal Service
 * ----------------
 * Business logic for proposal management.
 */
import { db } from "@/lib/db";
import { ApiError } from "../utils/ApiError";
import type { PaginatedQuery, PaginatedResult } from "./ClientService";

export class ProposalService {
  async list(query: PaginatedQuery): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize || 20));
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.title = { contains: query.search };
    }
    if (query.status) {
      where.status = query.status;
    }

    const orderBy = { [query.sortBy || "updatedAt"]: query.sortOrder || "desc" };

    const [data, total] = await Promise.all([
      db.proposal.findMany({
        skip,
        take: pageSize,
        where,
        orderBy,
        include: {
          project: { include: { client: true } },
          submission: true,
          author: true,
        },
      }),
      db.proposal.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getById(id: string) {
    const proposal = await db.proposal.findUnique({
      where: { id },
      include: {
        project: { include: { client: true } },
        submission: true,
        author: true,
      },
    });
    if (!proposal) throw ApiError.notFound("Proposal not found");
    return proposal;
  }

  async create(data: {
    title: string;
    sections?: Array<{ id: string; title: string; content: string }>;
    projectId?: string;
    submissionId?: string;
  }, userId?: string) {
    return db.proposal.create({
      data: {
        title: data.title,
        sections: JSON.stringify(data.sections || []),
        ...(data.projectId ? { projectId: data.projectId } : {}),
        ...(data.submissionId ? { submissionId: data.submissionId } : {}),
        ...(userId ? { authorId: userId } : {}),
      },
    });
  }

  async update(id: string, data: {
    title?: string;
    sections?: Array<{ id: string; title: string; content: string }>;
    status?: string;
  }) {
    const existing = await db.proposal.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Proposal not found");

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.sections !== undefined) updateData.sections = JSON.stringify(data.sections);
    if (data.status !== undefined) {
      updateData.status = data.status;
      // Increment version on status change
      updateData.version = { increment: 1 };
    }

    return db.proposal.update({ where: { id }, data: updateData });
  }

  async delete(id: string) {
    const existing = await db.proposal.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Proposal not found");
    await db.proposal.delete({ where: { id } });
    return { id };
  }
}

export const proposalService = new ProposalService();
