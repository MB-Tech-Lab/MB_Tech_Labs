/**
 * Invoice Service
 * ---------------
 * Business logic for invoice management.
 */
import { db } from "@/lib/db";
import { ApiError } from "../utils/ApiError";
import type { PaginatedQuery, PaginatedResult } from "./ClientService";

export class InvoiceService {
  async list(query: PaginatedQuery): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize || 20));
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.number = { contains: query.search };
    }
    if (query.status) {
      where.status = query.status;
    }

    const orderBy = { [query.sortBy || "createdAt"]: query.sortOrder || "desc" };

    const [data, total] = await Promise.all([
      db.invoice.findMany({
        skip,
        take: pageSize,
        where,
        orderBy,
        include: {
          client: true,
          project: true,
          quotation: true,
          payments: true,
        },
      }),
      db.invoice.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getById(id: string) {
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        project: true,
        quotation: true,
        payments: true,
      },
    });
    if (!invoice) throw ApiError.notFound("Invoice not found");
    return invoice;
  }

  async create(data: {
    number: string;
    amount: number;
    currency?: string;
    taxAmount?: number;
    issueDate?: string;
    dueDate?: string;
    notes?: string;
    clientId?: string;
    projectId?: string;
    quotationId?: string;
  }) {
    const totalAmount = data.amount + (data.taxAmount || 0);
    return db.invoice.create({
      data: {
        number: data.number,
        amount: data.amount,
        currency: data.currency || "USD",
        taxAmount: data.taxAmount || 0,
        totalAmount,
        issueDate: data.issueDate ? new Date(data.issueDate) : new Date(),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        notes: data.notes,
        ...(data.clientId ? { clientId: data.clientId } : {}),
        ...(data.projectId ? { projectId: data.projectId } : {}),
        ...(data.quotationId ? { quotationId: data.quotationId } : {}),
      },
    });
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await db.invoice.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Invoice not found");

    const updateData: Record<string, unknown> = {};
    const allowed = ["number", "amount", "currency", "taxAmount", "status", "notes"];
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate as string) : null;
    if (data.paidDate !== undefined) updateData.paidDate = data.paidDate ? new Date(data.paidDate as string) : null;

    // Recalculate total if amount or tax changed
    if (data.amount !== undefined || data.taxAmount !== undefined) {
      const amount = (data.amount as number) ?? existing.amount;
      const taxAmount = (data.taxAmount as number) ?? existing.taxAmount;
      updateData.totalAmount = amount + taxAmount;
    }

    return db.invoice.update({ where: { id }, data: updateData });
  }

  async delete(id: string) {
    const existing = await db.invoice.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Invoice not found");
    await db.invoice.delete({ where: { id } });
    return { id };
  }
}

export const invoiceService = new InvoiceService();
