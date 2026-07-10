/**
 * SRG Submission Repository
 * -------------------------
 * Data access for SRGSubmission + SRGAnswer models.
 */
import { prisma } from "../config/prisma";
import type { Prisma } from "@prisma/client";

export class SrgRepository {
  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.SRGSubmissionWhereInput;
    orderBy?: Prisma.SRGSubmissionOrderByWithRelationInput;
  }) {
    return prisma.sRGSubmission.findMany({
      ...params,
      include: {
        client: true,
        project: true,
        _count: { select: { uploads: true, proposals: true, quotations: true } },
      },
    });
  }

  async count(where?: Prisma.SRGSubmissionWhereInput): Promise<number> {
    return prisma.sRGSubmission.count({ where });
  }

  async findById(id: string) {
    return prisma.sRGSubmission.findUnique({
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
  }

  async create(data: Prisma.SRGSubmissionCreateInput) {
    return prisma.sRGSubmission.create({ data });
  }

  async update(id: string, data: Prisma.SRGSubmissionUpdateInput) {
    return prisma.sRGSubmission.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.sRGSubmission.delete({ where: { id } });
  }

  async createAnswers(answers: Array<{
    submissionId: string;
    questionId: string;
    questionLabel: string;
    questionType: string;
    sectionId?: string;
    sectionTitle?: string;
    value: string;
  }>) {
    if (answers.length === 0) return;
    await prisma.sRGAnswer.createMany({ data: answers });
  }
}

export const srgRepository = new SrgRepository();
