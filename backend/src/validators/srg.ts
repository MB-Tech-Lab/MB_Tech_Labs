/**
 * SRG Validators
 */
import { z } from "zod";

export const createSrgSchema = z.object({
  sessionId: z.string().min(1),
  templateId: z.string().min(1),
  templateName: z.string().min(1),
  projectType: z.string().min(1),
  projectName: z.string().min(1),
  // Client info (flat)
  clientInfo: z.object({
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    company: z.string(),
    jobTitle: z.string().optional().or(z.literal("")),
    country: z.string(),
    timezone: z.string(),
    preferredContact: z.string(),
  }),
  // Business info (flat)
  businessInfo: z.object({
    legalName: z.string(),
    industry: z.string(),
    size: z.string(),
    website: z.string().optional().or(z.literal("")),
    stage: z.string(),
    annualBudget: z.string(),
    targetLaunch: z.string(),
    existingStack: z.string().optional().or(z.literal("")),
    competitors: z.string().optional().or(z.literal("")),
  }).partial(),
  // Project goals
  projectGoals: z.object({
    primaryGoal: z.string(),
    secondaryGoals: z.array(z.string()).default([]),
    successMetrics: z.string(),
    deadline: z.string(),
    budgetRange: z.string(),
  }).partial(),
  // Dynamic SRG answers
  answers: z.record(z.any()).default({}),
  // SRG sections (for display)
  srgSections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    questions: z.array(z.object({
      id: z.string(),
      label: z.string(),
      type: z.string(),
      answer: z.any(),
    })),
  })).optional(),
  // Workflow
  workflow: z.record(z.any()).default({}),
  // Team requirements
  teamRequirements: z.object({
    roles: z.array(z.string()).default([]),
    permissions: z.array(z.string()).default([]),
  }).partial().optional(),
  // Uploads metadata (files are uploaded separately)
  uploads: z.array(z.object({
    id: z.string(),
    name: z.string(),
    size: z.number(),
    type: z.string(),
    category: z.string(),
  })).default([]),
});

export const updateSrgSchema = z.object({
  status: z.enum(["NEW", "REVIEWING", "MEETING_SCHEDULED", "APPROVED", "REJECTED", "ARCHIVED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  internalNotes: z.string().optional().or(z.literal("")),
  clientId: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
});

export type CreateSrgInput = z.infer<typeof createSrgSchema>;
export type UpdateSrgInput = z.infer<typeof updateSrgSchema>;
