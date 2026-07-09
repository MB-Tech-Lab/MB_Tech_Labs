/**
 * Client Service
 * --------------
 * Business logic for client management.
 */
import { clientRepository } from "../repositories/ClientRepository";
import { ApiError } from "../utils/ApiError";
import type { PaginatedResult, PaginatedQuery } from "../types";
import type { Client } from "@prisma/client";

export class ClientService {
  async list(query: PaginatedQuery): Promise<PaginatedResult<Client>> {
    const page = Math.max(1, parseInt(query.page || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize || "20", 10)));
    const skip = (page - 1) * pageSize;

    // Build where clause
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

    // Order
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";
    const orderBy = { [sortBy]: sortOrder };

    const [data, total] = await Promise.all([
      clientRepository.findMany({ skip, take: pageSize, where, orderBy }),
      clientRepository.count(where),
    ]);

    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getById(id: string) {
    const client = await clientRepository.findById(id);
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
    return clientRepository.create({
      ...data,
      status: data.status || "ACTIVE",
      ...(userId ? { createdBy: { connect: { id: userId } } } : {}),
    });
  }

  async update(id: string, data: Partial<{
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    website: string;
    industry: string;
    address: string;
    city: string;
    country: string;
    status: string;
    notes: string;
  }>) {
    const existing = await clientRepository.findById(id);
    if (!existing) throw ApiError.notFound("Client not found");
    return clientRepository.update(id, data);
  }

  async delete(id: string) {
    const existing = await clientRepository.findById(id);
    if (!existing) throw ApiError.notFound("Client not found");
    await clientRepository.delete(id);
    return { id };
  }
}

export const clientService = new ClientService();
