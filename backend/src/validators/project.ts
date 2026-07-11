/**
 * Project Validators
 */
import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  clientId: z.string().min(1, "Client is required"),
  status: z.enum(["DISCOVERY", "PLANNING", "UI_UX", "DEVELOPMENT", "TESTING", "DEPLOYMENT", "MAINTENANCE", "ON_HOLD", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  currentStage: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  estimatedHours: z.number().int().positive().optional(),
  budget: z.number().positive().optional(),
  technologyStack: z.array(z.string()).optional(),
  notes: z.string().max(5000).optional().or(z.literal("")),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  projectManagerId: z.string().optional().nullable(),
  assignedDeveloperIds: z.array(z.string()).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
