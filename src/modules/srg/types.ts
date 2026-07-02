/**
 * SRG Domain Types
 * ----------------
 * Core type definitions for the MB Tech Labs Project Discovery Portal.
 * These types describe templates, questions, answers, uploads, team roles,
 * workflows, and the full SRG session state. The runtime engine, storage
 * engine, upload engine, and React UI all share these contracts.
 *
 * NOTE: These are pure TypeScript types — no runtime imports. They describe
 * the shape of data flowing through the in-browser JavaScript runtime.
 */

/* ------------------------------------------------------------------ */
/* Templates                                                           */
/* ------------------------------------------------------------------ */

export type QuestionType =
  | "text"
  | "textarea"
  | "email"
  | "tel"
  | "number"
  | "url"
  | "date"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "rating"
  | "scale"
  | "boolean";

export type UploadCategory =
  | "branding"
  | "documents"
  | "media"
  | "data"
  | "legal"
  | "reference";

export interface QuestionCondition {
  /** id of another question whose answer must satisfy `op`/`value` */
  questionId: string;
  op: "eq" | "neq" | "in" | "not_in" | "contains" | "gt" | "lt" | "truthy";
  value: unknown;
}

export interface SrgQuestion {
  id: string;
  type: QuestionType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  /** conditional visibility */
  showIf?: QuestionCondition[];
  /** max for number / scale */
  max?: number;
  min?: number;
  /** max length for text/textarea */
  maxLength?: number;
  /** help text rendered below */
  help?: string;
  /** rating: number of stars; scale: max value */
  scale?: number;
}

export interface SrgSection {
  id: string;
  title: string;
  description?: string;
  questions: SrgQuestion[];
  /** conditional visibility at section level */
  showIf?: QuestionCondition[];
}

export interface TemplateUploadRequirement {
  category: UploadCategory;
  label: string;
  description?: string;
  required?: boolean;
  accept: string[];
  maxSizeMB: number;
  multiple?: boolean;
}

export interface WorkflowRequirement {
  flow: WorkflowFlowType;
  label: string;
  description?: string;
  required?: boolean;
  /** if true, the workflow builder will pre-seed default stages */
  defaultStages?: string[];
}

export type WorkflowFlowType =
  | "customer"
  | "approval"
  | "verification"
  | "payment"
  | "reporting"
  | "staff";

export interface SrgTemplate {
  id: string;
  name: string;
  description: string;
  /** short tagline shown on the selector card */
  tagline: string;
  /** lucide icon name (mapped in UI) */
  icon: string;
  /** accent gradient classes for the card */
  accent: string;
  sections: SrgSection[];
  uploadRequirements: TemplateUploadRequirement[];
  workflowRequirements: WorkflowRequirement[];
  /** default project goals suggested by template */
  suggestedGoals?: string[];
}

/* ------------------------------------------------------------------ */
/* Runtime / Session State                                            */
/* ------------------------------------------------------------------ */

export type AnswerValue =
  | string
  | number
  | boolean
  | string[]
  | null;

/** Map of questionId -> answer */
export type AnswersMap = Record<string, AnswerValue>;

export interface ClientDetails {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  country: string;
  timezone: string;
  preferredContact: "email" | "phone" | "video" | "";
}

export interface BusinessDetails {
  legalName: string;
  industry: string;
  size: "1-10" | "11-50" | "51-200" | "201-1000" | "1000+" | "";
  website: string;
  stage: "idea" | "startup" | "growth" | "enterprise" | "nonprofit" | "";
  annualBudget: string;
  targetLaunch: string;
  existingStack: string;
  competitors: string;
}

export interface ProjectGoals {
  primaryGoal: string;
  secondaryGoals: string[];
  successMetrics: string;
  priorities: {
    speed: number; // 1-5
    cost: number;
    quality: number;
    scalability: number;
    innovation: number;
  };
  deadline: string;
  budgetRange: string;
}

export interface TeamRole {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
}

export interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  owner: string;
  slaHours: number;
}

export interface WorkflowFlow {
  type: WorkflowFlowType;
  label: string;
  enabled: boolean;
  stages: WorkflowStage[];
}

export type WorkflowMap = Record<WorkflowFlowType, WorkflowFlow>;

/* ------------------------------------------------------------------ */
/* Uploads                                                            */
/* ------------------------------------------------------------------ */

export type UploadStatus =
  | "queued"
  | "processing"
  | "ready"
  | "error"
  | "rejected";

export interface UploadFileMeta {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  category: UploadCategory;
  previewUrl: string | null;
  status: UploadStatus;
  error?: string;
  uploadedAt: number;
  /** extracted metadata */
  width?: number;
  height?: number;
  durationSec?: number;
  pageCount?: number;
  lastModified?: number;
}

/* ------------------------------------------------------------------ */
/* Session                                                            */
/* ------------------------------------------------------------------ */

export interface SrgSession {
  sessionId: string;
  startedAt: number;
  updatedAt: number;
  currentStep: number;
  selectedTemplateId: string | null;
  clientDetails: ClientDetails;
  businessDetails: BusinessDetails;
  projectType: string;
  projectGoals: ProjectGoals;
  answers: AnswersMap;
  uploads: UploadFileMeta[];
  teamRoles: TeamRole[];
  workflow: WorkflowMap;
  /** marks submission state for Django sync later */
  submitted: boolean;
  submittedAt: number | null;
  submissionId: string | null;
}

export const SRG_STEPS = [
  "Client Information",
  "Business Information",
  "Project Type",
  "Project Goals",
  "Discovery Questions",
  "Document Upload",
  "Team Access",
  "Workflow Builder",
  "Final Review",
] as const;

export type SrgStepName = (typeof SRG_STEPS)[number];

/* ------------------------------------------------------------------ */
/* Submission payload (built by runtime, sent to Django later)        */
/* ------------------------------------------------------------------ */

export interface SrgSubmissionPayload {
  sessionId: string;
  templateId: string;
  clientDetails: ClientDetails;
  businessDetails: BusinessDetails;
  projectType: string;
  projectGoals: ProjectGoals;
  answers: AnswersMap;
  uploads: Array<
    Omit<UploadFileMeta, "file" | "previewUrl"> & {
      /** base64 data URL only for small preview; files sent separately */
      previewDataUrl: string | null;
    }
  >;
  teamRoles: TeamRole[];
  workflow: WorkflowMap;
  progress: { totalSteps: number; currentStep: number; completion: number };
  submittedAt: number;
  schemaVersion: string;
}
