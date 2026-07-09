/**
 * SRG Service
 * -----------
 * Business logic for Software Requirement Gathering submissions.
 * Handles ingestion from the /start-project portal, status updates.
 */
import { db } from "@/lib/db";
import { ApiError } from "../utils/ApiError";
import type { PaginatedQuery, PaginatedResult } from "./ClientService";

export class SrgService {
  async list(query: PaginatedQuery): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize || 20));
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.OR = [
        { projectName: { contains: query.search } },
        { templateName: { contains: query.search } },
        { sessionId: { contains: query.search } },
      ];
    }
    if (query.status) {
      where.status = query.status;
    }

    const orderBy = { [query.sortBy || "submittedAt"]: query.sortOrder || "desc" };

    const [data, total] = await Promise.all([
      db.sRGSubmission.findMany({
        skip,
        take: pageSize,
        where,
        orderBy,
        include: {
          client: true,
          project: true,
          _count: { select: { uploads: true, proposals: true, quotations: true } },
        },
      }),
      db.sRGSubmission.count({ where }),
    ]);

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getById(id: string) {
    const sub = await db.sRGSubmission.findUnique({
      where: { id },
      include: {
        client: true,
        project: true,
        answers: { orderBy: { createdAt: "asc" } },
        uploads: true,
        proposals: true,
        quotations: true,
        comments: { include: { author: true }, orderBy: { createdAt: "desc" } },
        timeline: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!sub) throw ApiError.notFound("SRG submission not found");
    return sub;
  }

  /**
   * Ingest a new SRG submission from the /start-project portal.
   * Stores the full payload as JSON, plus extracts individual answers.
   */
  async create(input: {
    sessionId: string;
    templateId: string;
    templateName: string;
    projectType: string;
    projectName: string;
    clientInfo: {
      fullName: string;
      email: string;
      phone: string;
      company: string;
      jobTitle?: string;
      country: string;
      timezone: string;
      preferredContact: string;
    };
    businessInfo?: Record<string, unknown>;
    projectGoals?: Record<string, unknown>;
    answers?: Record<string, unknown>;
    srgSections?: Array<{
      id: string;
      title: string;
      questions: Array<{ id: string; label: string; type: string; answer: unknown }>;
    }>;
    workflow?: Record<string, unknown>;
    teamRequirements?: { roles?: string[]; permissions?: string[] };
    uploads?: Array<{ id: string; name: string; size: number; type: string; category: string }>;
  }) {
    const payload = JSON.stringify({
      clientInfo: input.clientInfo,
      businessInfo: input.businessInfo,
      projectGoals: input.projectGoals,
      answers: input.answers,
      srgSections: input.srgSections,
      workflow: input.workflow,
      teamRequirements: input.teamRequirements,
      uploads: input.uploads,
    });

    // Detect priority from budget
    const budget = (input.businessInfo?.annualBudget as string) || "";
    let priority = "MEDIUM";
    if (budget === "above_150k" || budget === "50k_150k") priority = "HIGH";
    if ((input.projectGoals?.deadline as string) === "asap") priority = "CRITICAL";

    // Create or link client
    let clientId: string | undefined;
    const existingClient = await db.client.findFirst({
      where: {
        OR: [
          { companyName: input.clientInfo.company },
          { email: input.clientInfo.email },
        ],
      },
    });
    if (existingClient) {
      clientId = existingClient.id;
    } else {
      const newClient = await db.client.create({
        data: {
          companyName: input.clientInfo.company,
          contactName: input.clientInfo.fullName,
          email: input.clientInfo.email,
          phone: input.clientInfo.phone,
          country: input.clientInfo.country,
        },
      });
      clientId = newClient.id;
    }

    // Create the SRG submission
    const submission = await db.sRGSubmission.create({
      data: {
        sessionId: input.sessionId,
        templateId: input.templateId,
        templateName: input.templateName,
        projectType: input.projectType,
        projectName: input.projectName,
        status: "NEW",
        priority,
        payload,
        ...(clientId ? { clientId } : {}),
      },
    });

    // Extract individual answers from srgSections
    if (input.srgSections) {
      const answers: Array<{
        submissionId: string;
        questionId: string;
        questionLabel: string;
        questionType: string;
        sectionId?: string;
        sectionTitle?: string;
        value: string;
      }> = [];
      for (const section of input.srgSections) {
        for (const q of section.questions) {
          answers.push({
            submissionId: submission.id,
            questionId: q.id,
            questionLabel: q.label,
            questionType: q.type,
            sectionId: section.id,
            sectionTitle: section.title,
            value: JSON.stringify(q.answer),
          });
        }
      }
      if (answers.length > 0) {
        await db.sRGAnswer.createMany({ data: answers });
      }
    }

    // Add timeline event
    await db.timeline.create({
      data: {
        eventType: "SRG_SUBMITTED",
        title: "SRG Submitted",
        description: `New ${input.templateName} submission from ${input.clientInfo.company}`,
        submissionId: submission.id,
      },
    });

    return submission;
  }

  async update(id: string, data: {
    status?: string;
    priority?: string;
    internalNotes?: string;
    clientId?: string | null;
    projectId?: string | null;
  }) {
    const existing = await db.sRGSubmission.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("SRG submission not found");

    const updateData: Record<string, unknown> = {};
    if (data.status) {
      updateData.status = data.status;
      // Add timeline event on status change
      await db.timeline.create({
        data: {
          eventType: "STATUS_CHANGE",
          title: `Status: ${data.status}`,
          description: `SRG status changed to ${data.status}`,
          submissionId: id,
        },
      });
    }
    if (data.priority) updateData.priority = data.priority;
    if (data.internalNotes !== undefined) updateData.internalNotes = data.internalNotes;
    if (data.clientId !== undefined) updateData.clientId = data.clientId || null;
    if (data.projectId !== undefined) updateData.projectId = data.projectId || null;

    return db.sRGSubmission.update({ where: { id }, data: updateData });
  }

  async delete(id: string) {
    const existing = await db.sRGSubmission.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("SRG submission not found");
    await db.sRGSubmission.delete({ where: { id } });
    return { id };
  }
}

export const srgService = new SrgService();
