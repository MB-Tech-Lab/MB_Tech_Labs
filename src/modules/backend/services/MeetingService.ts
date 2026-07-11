/**
 * Meeting Service
 * ---------------
 * Business logic for meeting management.
 */
import { db } from "@/lib/db";
import { ApiError } from "../utils/ApiError";
import type { PaginatedQuery, PaginatedResult } from "./ClientService";

export class MeetingService {
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

    const orderBy = { [query.sortBy || "startTime"]: query.sortOrder || "asc" };

    const [data, total] = await Promise.all([
      db.meeting.findMany({
        skip,
        take: pageSize,
        where,
        orderBy,
        include: {
          project: { include: { client: true } },
          client: true,
          organizer: true,
        },
      }),
      db.meeting.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getById(id: string) {
    const meeting = await db.meeting.findUnique({
      where: { id },
      include: {
        project: { include: { client: true } },
        client: true,
        organizer: true,
      },
    });
    if (!meeting) throw ApiError.notFound("Meeting not found");
    return meeting;
  }

  async create(data: {
    title: string;
    description?: string;
    type?: string;
    startTime: string;
    endTime?: string;
    location?: string;
    meetingUrl?: string;
    projectId?: string;
    clientId?: string;
    organizerId?: string;
  }) {
    return db.meeting.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type || "VIDEO",
        status: "SCHEDULED",
        startTime: new Date(data.startTime),
        endTime: data.endTime ? new Date(data.endTime) : null,
        location: data.location,
        meetingUrl: data.meetingUrl,
        ...(data.projectId ? { projectId: data.projectId } : {}),
        ...(data.clientId ? { clientId: data.clientId } : {}),
        ...(data.organizerId ? { organizerId: data.organizerId } : {}),
      },
    });
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await db.meeting.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Meeting not found");

    const updateData: Record<string, unknown> = {};
    const allowed = ["title", "description", "type", "status", "location", "meetingUrl"];
    for (const key of allowed) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    if (data.startTime !== undefined) updateData.startTime = new Date(data.startTime as string);
    if (data.endTime !== undefined) updateData.endTime = data.endTime ? new Date(data.endTime as string) : null;

    return db.meeting.update({ where: { id }, data: updateData });
  }

  async delete(id: string) {
    const existing = await db.meeting.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Meeting not found");
    await db.meeting.delete({ where: { id } });
    return { id };
  }
}

export const meetingService = new MeetingService();
