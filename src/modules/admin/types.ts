/**
 * Admin Domain Types
 * ------------------
 * Type definitions for the MB Tech Labs Project Control Center.
 * Every submission, team assignment, proposal, and quotation is
 * described here. All data lives in localStorage under
 * `mbtl_submissions` — no backend yet.
 */

/* --------------------------- Project Status --------------------------- */

export type ProjectStatus =
  | "New"
  | "Reviewing"
  | "Meeting Scheduled"
  | "Approved"
  | "Rejected"
  | "Archived";

/**
 * Phase 1 lifecycle: a simplified flow used by the Project Request
 * Dashboard. Later phases will extend this with proposal, quotation,
 * development, testing, delivery, and completion statuses.
 */
export const PROJECT_STATUS_FLOW: ProjectStatus[] = [
  "New",
  "Reviewing",
  "Meeting Scheduled",
  "Approved",
  "Rejected",
  "Archived",
];

/** Statuses that count as "open" (not yet decided) for the dashboard. */
export const OPEN_STATUSES: ProjectStatus[] = [
  "New",
  "Reviewing",
  "Meeting Scheduled",
];

export type Priority = "Low" | "Medium" | "High" | "Critical";

/* --------------------------- Client Info --------------------------- */

export interface ClientInfo {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  country: string;
  timezone: string;
  preferredContact: string;
}

export interface BusinessInfo {
  legalName: string;
  industry: string;
  size: string;
  website: string;
  stage: string;
  annualBudget: string;
  targetLaunch: string;
  existingStack: string;
  competitors: string;
  mission?: string;
  vision?: string;
  targetAudience?: string;
  description?: string;
}

export interface ProjectGoals {
  primaryGoal: string;
  secondaryGoals: string[];
  successMetrics: string;
  priorities: {
    speed: number;
    cost: number;
    quality: number;
    scalability: number;
    innovation: number;
  };
  deadline: string;
  budgetRange: string;
}

/* --------------------------- Uploads --------------------------- */

export type UploadCategory =
  | "Logo"
  | "Certificates"
  | "Brand Assets"
  | "Documents"
  | "Wireframes"
  | "Reference Images"
  | "Videos"
  | "API Documents"
  | "Data"
  | "Legal"
  | "Reference";

export interface SubmissionUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  category: UploadCategory | string;
  status: string;
  uploadedAt: number;
  width?: number;
  height?: number;
  durationSec?: number;
  pageCount?: number;
  previewDataUrl?: string | null;
}

/* --------------------------- Team --------------------------- */

export type TeamRole =
  | "Project Manager"
  | "Frontend Developer"
  | "Backend Developer"
  | "UI Designer"
  | "QA Engineer"
  | "DevOps"
  | "Business Analyst";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole | string;
  avatar?: string;
  initials: string;
  capacity: number; // hours/week
  skills: string[];
}

export interface AssignedTeam {
  [role: string]: string | null; // role -> team member id
}

/* --------------------------- Workflow --------------------------- */

export interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  owner: string;
  slaHours: number;
}

export interface WorkflowFlow {
  type: string;
  label: string;
  enabled: boolean;
  stages: WorkflowStage[];
}

export type WorkflowMap = Record<string, WorkflowFlow>;

/* --------------------------- Proposal --------------------------- */

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
}

export interface Proposal {
  id: string;
  createdAt: number;
  updatedAt: number;
  status: "draft" | "sent" | "accepted" | "rejected";
  sections: ProposalSection[];
}

/* --------------------------- Quotation --------------------------- */

export interface QuotationLineItem {
  id: string;
  category: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Quotation {
  id: string;
  createdAt: number;
  updatedAt: number;
  status: "draft" | "sent" | "accepted" | "rejected";
  items: QuotationLineItem[];
  paymentTerms: string;
  taxRate: number; // percentage
  discount: number; // percentage
  currency: string;
  validUntil: string;
  notes: string;
}

/* --------------------------- Timeline --------------------------- */

export interface TimelineEvent {
  status: ProjectStatus;
  timestamp: number | null;
  note?: string;
}

/* --------------------------- Submission --------------------------- */

export interface AdminSubmission {
  id: string;
  sessionId: string;
  submittedAt: number;
  updatedAt: number;
  templateId: string;
  templateName: string;
  projectType: string;
  projectName: string;
  client: ClientInfo;
  business: BusinessInfo;
  goals: ProjectGoals;
  answers: Record<string, unknown>;
  uploads: SubmissionUpload[];
  teamRequirements: {
    staffCount?: number;
    roles: string[];
    permissions: string[];
    approvalHierarchy: string[];
  };
  workflow: WorkflowMap;
  status: ProjectStatus;
  priority: Priority;
  assignedTeam: AssignedTeam;
  proposal: Proposal | null;
  quotation: Quotation | null;
  notes: string;
  timeline: TimelineEvent[];
  // sections extracted from the SRG template (for display)
  srgSections?: Array<{
    id: string;
    title: string;
    questions: Array<{
      id: string;
      label: string;
      type: string;
      answer: unknown;
    }>;
  }>;
}

/* --------------------------- Notifications --------------------------- */

export interface AdminNotification {
  id: string;
  type: "submission" | "proposal" | "quotation" | "team" | "system";
  title: string;
  description: string;
  timestamp: number;
  read: boolean;
  submissionId?: string;
}

/* --------------------------- Stats --------------------------- */

/**
 * Phase 1 dashboard stats. Field names are stable (used by storage and
 * context) but the semantic meaning is:
 *   - totalLeads       -> Total Project Requests
 *   - newSubmissions   -> New Requests
 *   - inReview         -> Under Review
 *   - proposalPending  -> Meeting Scheduled
 *   - approved         -> Approved
 *   - inDevelopment    -> Rejected
 *   - completed        -> Archived
 */
export interface DashboardStats {
  totalLeads: number;
  newSubmissions: number;
  inReview: number;
  proposalPending: number;
  approved: number;
  inDevelopment: number;
  completed: number;
}
