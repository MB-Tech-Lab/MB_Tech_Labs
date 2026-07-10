/**
 * Quotation Service
 * -----------------
 * Business logic for quotation management.
 */
import { db } from "@/lib/db";
import { ApiError } from "../utils/ApiError";
import type { PaginatedQuery, PaginatedResult } from "./ClientService";

export class QuotationService {
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
      db.quotation.findMany({
        skip,
        take: pageSize,
        where,
        orderBy,
        include: {
          project: { include: { client: true } },
          submission: true,
          invoices: true,
        },
      }),
      db.quotation.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getById(id: string) {
    const quotation = await db.quotation.findUnique({
      where: { id },
      include: {
        project: { include: { client: true } },
        submission: true,
        invoices: true,
      },
    });
    if (!quotation) throw ApiError.notFound("Quotation not found");
    return quotation;
  }

  async create(data: {
    title: string;
    items?: Array<{ id: string; category: string; description: string; qty: number; unitPrice: number }>;
    currency?: string;
    taxRate?: number;
    discount?: number;
    paymentTerms?: string;
    validUntil?: string;
    notes?: string;
    projectId?: string;
    submissionId?: string;
  }) {
    const items = data.items || [];
    const subtotal = items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);
    const discountAmount = (subtotal * (data.discount || 0)) / 100;
    const taxableAmount = subtotal - discountAmount;
    const tax = (taxableAmount * (data.taxRate || 0)) / 100;
    const totalAmount = taxableAmount + tax;

    return db.quotation.create({
      data: {
        title: data.title,
        items: JSON.stringify(items),
        currency: data.currency || "USD",
        taxRate: data.taxRate || 0,
        discount: data.discount || 0,
        paymentTerms: data.paymentTerms,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        notes: data.notes,
        totalAmount,
        ...(data.projectId ? { projectId: data.projectId } : {}),
        ...(data.submissionId ? { submissionId: data.submissionId } : {}),
      },
    });
  }

  async update(id: string, data: {
    title?: string;
    items?: Array<{ id: string; category: string; description: string; qty: number; unitPrice: number }>;
    currency?: string;
    taxRate?: number;
    discount?: number;
    paymentTerms?: string;
    validUntil?: string;
    notes?: string;
    status?: string;
  }) {
    const existing = await db.quotation.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Quotation not found");

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.taxRate !== undefined) updateData.taxRate = data.taxRate;
    if (data.discount !== undefined) updateData.discount = data.discount;
    if (data.paymentTerms !== undefined) updateData.paymentTerms = data.paymentTerms;
    if (data.validUntil !== undefined) updateData.validUntil = data.validUntil ? new Date(data.validUntil) : null;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.status !== undefined) updateData.status = data.status;

    // Recalculate total if items changed
    if (data.items !== undefined) {
      updateData.items = JSON.stringify(data.items);
      const subtotal = data.items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);
      const discountAmount = (subtotal * (data.discount || existing.discount)) / 100;
      const taxableAmount = subtotal - discountAmount;
      const tax = (taxableAmount * (data.taxRate || existing.taxRate)) / 100;
      updateData.totalAmount = taxableAmount + tax;
    }

    return db.quotation.update({ where: { id }, data: updateData });
  }

  async delete(id: string) {
    const existing = await db.quotation.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Quotation not found");
    await db.quotation.delete({ where: { id } });
    return { id };
  }
}

export const quotationService = new QuotationService();
