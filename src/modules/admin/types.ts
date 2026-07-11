/**
 * Admin Domain Types — Enterprise Edition
 * ----------------------------------------
 * Full type system for the MB Tech Labs internal operating system.
 * Covers SRG submissions, clients, projects, proposals, quotations,
 * invoices, team, meetings, tasks, activities, and notifications.
 *
 * All data lives in localStorage during development. The shapes are
 * designed to map 1:1 to future Prisma/PostgreSQL models.
 */

/* --------------------------- Project Status (SRG lifecycle) --------------------------- */

export type SrgStatus =
  | "New"
  | "Reviewing"
  | "Meeting Scheduled"
  | "Proposal Ready"
  | "Quotation Sent"
  | "Negotiation"
  | "Approved"
  | "Rejected"
  | "Archived";

export const SRG_STATUS_FLOW: SrgStatus[] = [
  "New",
  "Reviewing",
  "Meeting Scheduled",
  "Proposal Ready",
  "Quotation Sent",
  "Negotiation",
  "Approved",
  "Rejected",
  "Archived",
];

/** Keep legacy alias for backward compat with existing code */
export type ProjectStatus = SrgStatus;
export const PROJECT_STATUS_FLOW = SRG_STATUS_FLOW;

/** Statuses that count as "open" (not yet decided) */
export const OPEN_STATUSES: SrgStatus[] = [
  "New",
  "Reviewing",
  "Meeting Scheduled",
  "Proposal Ready",
  "Quotation Sent",
  "Negotiation",
];

export type Priority = "Low" | "Medium" | "High" | "Critical";

/* --------------------------- Project (dev project) Status --------------------------- */

export type DevProjectStatus =
  | "Discovery"
  | "Planning"
  | "UI/UX"
  | "Development"
  | "Testing"
  | "Deployment"
  | "Maintenance"
  | "On Hold"
  | "Cancelled";

export const DEV_PROJECT_STAGES: DevProjectStatus[] = [
  "Discovery",
  "Planning",
  "UI/UX",
  "Development",
  "Testing",
  "Deployment",
  "Maintenance",
];

export const DEV_PROJECT_STAGE_PROGRESS: Record<DevProjectStatus, number> = {
  Discovery: 5,
  Planning: 15,
  "UI/UX": 30,
  Development: 60,
  Testing: 80,
  Deployment: 90,
  Maintenance: 100,
  "On Hold": 0,
  Cancelled: 0,
};

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

/* --------------------------- Client Entity (CRM) --------------------------- */

export interface Client {
  id: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  address: string;
  status: "Active" | "Inactive" | "Prospect" | "Blacklisted";
  createdAt: number;
  notes: string;
  submissionIds: string[];
  projectIds: string[];
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
  status?: "Available" | "Busy" | "On Leave";
  assignedProjectIds?: string[];
}

export type AssignedTeam = Record<string, string | null>;

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
  taxRate: number;
  discount: number;
  currency: string;
  validUntil: string;
  notes: string;
}

/* --------------------------- Invoice --------------------------- */

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientCompany: string;
  amount: number;
  currency: string;
  status: "Paid" | "Pending" | "Overdue" | "Draft";
  issueDate: number;
  dueDate: number;
  paidDate?: number;
  items: { description: string; amount: number }[];
  notes?: string;
  projectId?: string;
}

/* --------------------------- Dev Project --------------------------- */

export interface DevProject {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  clientCompany: string;
  submissionId?: string;
  status: DevProjectStatus;
  priority: Priority;
  techStack: string[];
  assignedTeam: AssignedTeam;
  startDate: number;
  estimatedEndDate: number;
  currentStage: DevProjectStatus;
  progress: number; // 0-100
  budget: number;
  currency: string;
  description: string;
  tasks: Task[];
  milestones: Milestone[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId?: string;
  status: "To Do" | "In Progress" | "Review" | "Done";
  priority: Priority;
  dueDate?: number;
  createdAt: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: number;
  completed: boolean;
  completedAt?: number;
}

/* --------------------------- Meeting / Calendar --------------------------- */

export interface Meeting {
  id: string;
  title: string;
  type: "client" | "internal" | "review" | "kickoff" | "follow-up";
  clientId?: string;
  clientName?: string;
  projectId?: string;
  date: number; // timestamp
  duration: number; // minutes
  attendees: string[];
  location: string;
  notes: string;
  status: "scheduled" | "completed" | "cancelled";
}

/* --------------------------- Activity Log --------------------------- */

export interface ActivityLog {
  id: string;
  type: "submission" | "project" | "proposal" | "quotation" | "invoice" | "team" | "meeting" | "client" | "system";
  action: string;
  description: string;
  timestamp: number;
  entityId?: string;
  entityType?: string;
  actor?: string;
}

/* --------------------------- Timeline --------------------------- */

export interface TimelineEvent {
  status: SrgStatus;
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
  status: SrgStatus;
  priority: Priority;
  assignedTeam: AssignedTeam;
  proposal: Proposal | null;
  quotation: Quotation | null;
  notes: string;
  timeline: TimelineEvent[];
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
  type: "submission" | "proposal" | "quotation" | "invoice" | "team" | "meeting" | "system" | "project";
  title: string;
  description: string;
  timestamp: number;
  read: boolean;
  submissionId?: string;
  projectId?: string;
  invoiceId?: string;
}

/* --------------------------- Stats --------------------------- */

export interface DashboardStats {
  totalLeads: number;
  newSubmissions: number;
  inReview: number;
  proposalPending: number;
  approved: number;
  inDevelopment: number;
  completed: number;
  // extended stats
  activeProjects: number;
  totalRevenue: number;
  pendingQuotations: number;
  pendingProposals: number;
  upcomingMeetings: number;
}

/* --------------------------- Auth Roles --------------------------- */

export type UserRole =
  | "Super Admin"
  | "Admin"
  | "Project Manager"
  | "Sales"
  | "Developer"
  | "Viewer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  initials: string;
}
