/**
 * Application Service
 * -------------------
 * Handles candidate applications, scorecards, status pipeline, and conversion.
 */
import { db } from "@/lib/db";
import { ApiError } from "../utils/ApiError";
import type { PaginatedQuery, PaginatedResult } from "./ClientService";

export const PIPELINE_STAGES = [
  "APPLIED",
  "RESUME_REVIEWED",
  "PROJECT_REVIEWED",
  "TECHNICAL_DISCUSSION",
  "SELECTED",
  "OFFER_SENT",
  "JOINED",
  "TRAINING",
  "COMPLETED",
  "REJECTED",
] as const;

export class ApplicationService {
  async list(query: PaginatedQuery & { status?: string; positionId?: string }): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize || 20));
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.OR = [
        { candidate: { name: { contains: query.search } } },
        { candidate: { email: { contains: query.search } } },
        { position: { title: { contains: query.search } } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.positionId) where.positionId = query.positionId;

    const orderBy = { [query.sortBy || "appliedAt"]: query.sortOrder || "desc" };

    const [data, total] = await Promise.all([
      db.application.findMany({
        skip, take: pageSize, where, orderBy,
        include: {
          candidate: { include: { projects: true, hackathons: true } },
          position: true,
          reviewedBy: true,
        },
      }),
      db.application.count({ where }),
    ]);

    return { data, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async getById(id: string) {
    const app = await db.application.findUnique({
      where: { id },
      include: {
        candidate: { include: { projects: true, hackathons: true } },
        position: true,
        reviewedBy: true,
        technicalReviews: { include: { reviewer: true } },
        interviews: { include: { interviewer: true, feedback: true } },
        notes: { include: { author: true }, orderBy: { createdAt: "desc" } },
        activities: { orderBy: { createdAt: "desc" } },
        certificates: true,
        trainingRecords: { include: { batch: true, mentor: true } },
      },
    });
    if (!app) throw ApiError.notFound("Application not found");
    return app;
  }

  /**
   * Public: submit an application from the career portal.
   * Creates/updates the Candidate, creates the Application, stores projects + hackathons.
   */
  async submit(input: {
    positionId: string;
    // Personal
    name: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    city?: string;
    state?: string;
    country?: string;
    // Education
    college?: string;
    university?: string;
    degree?: string;
    branch?: string;
    cgpa?: number;
    currentSemester?: number;
    graduationYear?: number;
    // Technical
    skills?: string[];
    // Portfolio
    portfolioWebsite?: string;
    githubProfile?: string;
    linkedinProfile?: string;
    resumePath?: string;
    // Essay
    whyJoin?: string;
    techInterest?: string;
    bestProject?: string;
    careerGoals?: string;
    // Projects
    projects?: Array<{
      name: string;
      description?: string;
      technology?: string;
      githubUrl?: string;
      liveDemoUrl?: string;
      role?: string;
      achievements?: string;
    }>;
    // Hackathons
    hackathons?: Array<{
      name: string;
      year?: number;
      rank?: string;
      repositoryUrl?: string;
    }>;
  }) {
    // Verify position exists and is published
    const position = await db.internshipPosition.findUnique({ where: { id: input.positionId } });
    if (!position) throw ApiError.notFound("Position not found");
    if (position.status !== "PUBLISHED") throw ApiError.badRequest("This position is no longer accepting applications");

    // Check for duplicate application
    const existingCandidate = await db.candidate.findUnique({ where: { email: input.email } });
    if (existingCandidate) {
      const existingApp = await db.application.findFirst({
        where: { candidateId: existingCandidate.id, positionId: input.positionId },
      });
      if (existingApp) throw ApiError.conflict("You have already applied for this position");
    }

    // Create or update candidate
    const candidateData = {
      name: input.name,
      email: input.email,
      phone: input.phone,
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
      gender: input.gender,
      city: input.city,
      state: input.state,
      country: input.country,
      college: input.college,
      university: input.university,
      degree: input.degree,
      branch: input.branch,
      cgpa: input.cgpa,
      currentSemester: input.currentSemester,
      graduationYear: input.graduationYear,
      skills: input.skills ? JSON.stringify(input.skills) : null,
      portfolioWebsite: input.portfolioWebsite,
      githubProfile: input.githubProfile,
      linkedinProfile: input.linkedinProfile,
      resumePath: input.resumePath,
      whyJoin: input.whyJoin,
      techInterest: input.techInterest,
      bestProject: input.bestProject,
      careerGoals: input.careerGoals,
    };

    const candidate = existingCandidate
      ? await db.candidate.update({ where: { id: existingCandidate.id }, data: candidateData })
      : await db.candidate.create({ data: candidateData });

    // Create application
    const application = await db.application.create({
      data: {
        candidateId: candidate.id,
        positionId: input.positionId,
        status: "APPLIED",
      },
    });

    // Store projects
    if (input.projects && input.projects.length > 0) {
      // Delete old projects if updating
      await db.candidateProject.deleteMany({ where: { candidateId: candidate.id } });
      await db.candidateProject.createMany({
        data: input.projects.map((p) => ({ ...p, candidateId: candidate.id })),
      });
    }

    // Store hackathons
    if (input.hackathons && input.hackathons.length > 0) {
      await db.candidateHackathon.deleteMany({ where: { candidateId: candidate.id } });
      await db.candidateHackathon.createMany({
        data: input.hackathons.map((h) => ({ ...h, candidateId: candidate.id })),
      });
    }

    // Add activity
    await db.recruitmentActivity.create({
      data: {
        applicationId: application.id,
        candidateId: candidate.id,
        action: "APPLICATION_SUBMITTED",
        description: `Applied for ${position.title}`,
      },
    });

    return { application, candidate };
  }

  async updateStatus(id: string, status: string, userId?: string) {
    const app = await db.application.findUnique({ where: { id } });
    if (!app) throw ApiError.notFound("Application not found");

    const updated = await db.application.update({
      where: { id },
      data: {
        status,
        ...(userId ? { reviewedById: userId } : {}),
      },
    });

    await db.recruitmentActivity.create({
      data: {
        applicationId: id,
        candidateId: app.candidateId,
        action: "STATUS_CHANGE",
        description: `Status changed to ${status}`,
      },
    });

    return updated;
  }

  async updateScorecard(id: string, scores: {
    scoreProgramming?: number;
    scoreProjects?: number;
    scoreHackathons?: number;
    scoreGithub?: number;
    scoreCommunication?: number;
    scoreAttitude?: number;
  }) {
    const app = await db.application.findUnique({ where: { id } });
    if (!app) throw ApiError.notFound("Application not found");

    const total =
      (scores.scoreProgramming ?? app.scoreProgramming) +
      (scores.scoreProjects ?? app.scoreProjects) +
      (scores.scoreHackathons ?? app.scoreHackathons) +
      (scores.scoreGithub ?? app.scoreGithub) +
      (scores.scoreCommunication ?? app.scoreCommunication) +
      (scores.scoreAttitude ?? app.scoreAttitude);

    return db.application.update({
      where: { id },
      data: { ...scores, totalScore: total },
    });
  }

  async addNote(applicationId: string, content: string, userId?: string) {
    return db.recruitmentNote.create({
      data: {
        applicationId,
        candidateId: (await db.application.findUnique({ where: { id: applicationId } }))?.candidateId || "",
        content,
        ...(userId ? { authorId: userId } : {}),
      },
      include: { author: true },
    });
  }

  async delete(id: string) {
    const existing = await db.application.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("Application not found");
    await db.application.delete({ where: { id } });
    return { id };
  }

  /**
   * Convert a completed intern to a team member (User).
   * Prevents duplicate records by checking email.
   */
  async convertToEmployee(applicationId: string) {
    const app = await db.application.findUnique({
      where: { id: applicationId },
      include: { candidate: true },
    });
    if (!app) throw ApiError.notFound("Application not found");
    if (!app.candidate) throw ApiError.notFound("Candidate not found");

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email: app.candidate.email } });
    if (existingUser) {
      // Update candidate status
      await db.candidate.update({
        where: { id: app.candidate.id },
        data: { status: "CONVERTED" },
      });
      await this.updateStatus(applicationId, "COMPLETED");
      return { user: existingUser, alreadyExisted: true };
    }

    // Create new user with default DEVELOPER role
    const bcrypt = await import("bcryptjs");
    const tempPassword = Math.random().toString(36).slice(2, 12);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = await db.user.create({
      data: {
        email: app.candidate.email,
        name: app.candidate.name,
        passwordHash,
        role: "DEVELOPER",
      },
    });

    // Update candidate + application status
    await db.candidate.update({
      where: { id: app.candidate.id },
      data: { status: "CONVERTED" },
    });
    await this.updateStatus(applicationId, "COMPLETED");

    return { user, tempPassword, alreadyExisted: false };
  }

  async getStats() {
    const [
      openPositions,
      newApplications,
      pendingReviews,
      interviewsScheduled,
      internsInTraining,
      certificatesIssued,
      convertedEmployees,
    ] = await Promise.all([
      db.internshipPosition.count({ where: { status: "PUBLISHED" } }),
      db.application.count({ where: { status: "APPLIED" } }),
      db.application.count({ where: { status: { in: ["APPLIED", "RESUME_REVIEWED", "PROJECT_REVIEWED"] } } }),
      db.interview.count({ where: { status: "SCHEDULED", scheduledAt: { gte: new Date() } } }),
      db.trainingRecord.count({ where: { status: { in: ["ORIENTATION", "TRAINING", "INTERNAL_PROJECT", "CLIENT_PROJECT", "EVALUATION"] } } }),
      db.certificate.count(),
      db.candidate.count({ where: { status: "CONVERTED" } }),
    ]);

    return {
      openPositions,
      newApplications,
      pendingReviews,
      interviewsScheduled,
      internsInTraining,
      certificatesIssued,
      convertedEmployees,
    };
  }
}

export const applicationService = new ApplicationService();
