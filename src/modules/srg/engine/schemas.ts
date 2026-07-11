/**
 * Runtime Validation Schemas
 * --------------------------
 * Zod schemas powering the SRG runtime engine. Each step has its own
 * schema, and the final submission gets a full payload schema. These
 * run entirely in the browser — no backend required.
 */
import { z } from "zod";

/* ---------- Step 1: Client Information ---------- */
export const clientDetailsSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name is too long"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .max(24, "Phone number is too long")
    .regex(/^[+\d\s()-]+$/, "Phone can only contain digits, spaces, +, -, ()"),
  company: z.string().min(2, "Company name is required").max(120),
  jobTitle: z.string().max(80).optional().or(z.literal("")),
  country: z.string().min(2, "Select your country"),
  timezone: z.string().min(2, "Select your timezone"),
  preferredContact: z.enum(["email", "phone", "video"], {
    errorMap: () => ({ message: "Choose a preferred contact method" }),
  }),
});

/* ---------- Step 2: Business Information ---------- */
export const businessDetailsSchema = z.object({
  legalName: z.string().min(2, "Legal name is required").max(160),
  industry: z.string().min(2, "Select an industry"),
  size: z.enum(["1-10", "11-50", "51-200", "201-1000", "1000+"], {
    errorMap: () => ({ message: "Select company size" }),
  }),
  website: z
    .string()
    .url("Enter a valid website URL (https://...)")
    .or(z.literal("")),
  stage: z.enum(
    ["idea", "startup", "growth", "enterprise", "nonprofit"],
    { errorMap: () => ({ message: "Select business stage" }) }
  ),
  annualBudget: z.string().min(1, "Select a budget range"),
  targetLaunch: z.string().min(2, "Select a target launch window"),
  existingStack: z.string().max(800).optional().or(z.literal("")),
  competitors: z.string().max(800).optional().or(z.literal("")),
});

/* ---------- Step 3: Project Type ---------- */
export const projectTypeSchema = z.object({
  projectType: z.string().min(1, "Select a project type"),
  selectedTemplateId: z.string().min(1, "Select a project template"),
});

/* ---------- Step 4: Project Goals ---------- */
export const projectGoalsSchema = z.object({
  primaryGoal: z.string().min(8, "Describe your primary goal (min 8 chars)").max(500),
  secondaryGoals: z
    .array(z.string())
    .max(8, "Maximum 8 secondary goals")
    .default([]),
  successMetrics: z
    .string()
    .min(8, "How will you measure success?")
    .max(800),
  priorities: z.object({
    speed: z.number().min(1).max(5),
    cost: z.number().min(1).max(5),
    quality: z.number().min(1).max(5),
    scalability: z.number().min(1).max(5),
    innovation: z.number().min(1).max(5),
  }),
  deadline: z.string().min(2, "Select a deadline"),
  budgetRange: z.string().min(2, "Select a budget range"),
});

/* ---------- Step 5: Dynamic SRG Questions ---------- */
/**
 * Dynamic question validation is built per-template at runtime — see
 * engine/validator.ts -> buildAnswersSchema(). This is a fallback that
 * accepts any answer shape.
 */
export const answersFallbackSchema = z.record(z.any());

/* ---------- Step 7: Team Access ---------- */
export const teamRoleSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  role: z.string().min(2, "Role is required"),
  department: z.string().min(2, "Department is required"),
  permissions: z.array(z.string()).default([]),
});

export const teamRolesSchema = z
  .array(teamRoleSchema)
  .max(50, "Maximum 50 team roles")
  .default([]);

/* ---------- Step 8: Workflow ---------- */
export const workflowStageSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Stage name required"),
  description: z.string().max(400).optional().or(z.literal("")),
  owner: z.string().min(2, "Owner required"),
  slaHours: z.number().min(1, "SLA must be at least 1 hour").max(720),
});

export const workflowFlowSchema = z.object({
  type: z.string(),
  label: z.string(),
  enabled: z.boolean(),
  stages: z.array(workflowStageSchema).min(1, "Each enabled flow needs at least 1 stage"),
});

/* ---------- Upload validation ---------- */
export const MAX_UPLOAD_MB = 100;
export const ACCEPTED_UPLOAD_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "text/csv",
  "application/json",
];

export const uploadMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number().max(MAX_UPLOAD_MB * 1024 * 1024, "File too large"),
  type: z.string().refine((t) => ACCEPTED_UPLOAD_TYPES.includes(t), {
    message: "Unsupported file type",
  }),
  category: z.string(),
  status: z.string(),
});

/* ---------- Final payload ---------- */
export const submissionPayloadSchema = z.object({
  sessionId: z.string(),
  templateId: z.string(),
  clientDetails: clientDetailsSchema,
  businessDetails: businessDetailsSchema,
  projectType: z.string(),
  projectGoals: projectGoalsSchema,
  answers: z.record(z.any()),
  uploads: z.array(z.any()),
  teamRoles: z.array(teamRoleSchema),
  workflow: z.record(z.any()),
  progress: z.object({
    totalSteps: z.number(),
    currentStep: z.number(),
    completion: z.number(),
  }),
  submittedAt: z.number(),
  schemaVersion: z.string(),
});

export type ClientDetailsInput = z.infer<typeof clientDetailsSchema>;
export type BusinessDetailsInput = z.infer<typeof businessDetailsSchema>;
export type ProjectGoalsInput = z.infer<typeof projectGoalsSchema>;
export type TeamRoleInput = z.infer<typeof teamRoleSchema>;
