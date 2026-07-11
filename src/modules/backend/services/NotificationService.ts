/**
 * Notification Service
 * --------------------
 * Business logic for notifications.
 */
import { db } from "@/lib/db";
import { ApiError } from "../utils/ApiError";
import type { PaginatedQuery, PaginatedResult } from "./ClientService";

export class NotificationService {
  async list(query: PaginatedQuery & { userId?: string }): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize || 20));
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.userId) {
      where.userId = query.userId;
    }
    if (query.status === "unread") {
      where.isRead = false;
    }

    const orderBy = { [query.sortBy || "createdAt"]: query.sortOrder || "desc" };

    const [data, total] = await Promise.all([
      db.notification.findMany({
        skip,
        take: pageSize,
        where,
        orderBy,
      }),
      db.notification.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async markAsRead(id: string) {
    const existing = await db.notification.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Notification not found");
    return db.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId?: string) {
    const where: Record<string, unknown> = { isRead: false };
    if (userId) where.userId = userId;
    const result = await db.notification.updateMany({
      where,
      data: { isRead: true },
    });
    return { updated: result.count };
  }

  async delete(id: string) {
    const existing = await db.notification.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Notification not found");
    await db.notification.delete({ where: { id } });
    return { id };
  }

  /**
   * Create a notification. Used internally by other services.
   */
  async create(data: {
    type: string;
    title: string;
    description: string;
    userId?: string;
    submissionId?: string;
    projectId?: string;
    clientId?: string;
  }) {
    return db.notification.create({ data });
  }
}

export const notificationService = new NotificationService();
