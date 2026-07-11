/**
 * Client Repository
 * -----------------
 * Data access for Client model.
 */
import { prisma } from "../config/prisma";
import type { Prisma } from "@prisma/client";

export class ClientRepository {
  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ClientWhereInput;
    orderBy?: Prisma.ClientOrderByWithRelationInput;
  }) {
    return prisma.client.findMany({
      ...params,
      include: {
        _count: { select: { projects: true, submissions: true, invoices: true } },
      },
    });
  }

  async count(where?: Prisma.ClientWhereInput): Promise<number> {
    return prisma.client.count({ where });
  }

  async findById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        projects: true,
        submissions: { orderBy: { submittedAt: "desc" } },
        invoices: { orderBy: { createdAt: "desc" } },
        documents: true,
        meetings: { orderBy: { startTime: "desc" } },
        comments: { include: { author: true }, orderBy: { createdAt: "desc" } },
        timeline: { orderBy: { createdAt: "desc" } },
        createdBy: true,
      },
    });
  }

  async create(data: Prisma.ClientCreateInput) {
    return prisma.client.create({ data });
  }

  async update(id: string, data: Prisma.ClientUpdateInput) {
    return prisma.client.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.client.delete({ where: { id } });
  }
}

export const clientRepository = new ClientRepository();
