/**
 * SRG Runtime Engine
 * ------------------
 * Pure in-browser business logic. This module is the heart of the
 * frontend JavaScript runtime — it powers dynamic form rendering,
 * conditional questions, validation, normalization, and submission
 * payload construction.
 *
 * No backend. No Node. No Express. Everything runs in the browser.
 */
import type {
  AnswersMap,
  QuestionCondition,
  SrgQuestion,
  SrgSection,
  SrgTemplate,
  SrgSubmissionPayload,
  SrgSession,
  WorkflowFlowType,
} from "../types";
import { getTemplate } from "../templates";
import { z } from "zod";
import { SRG_STEPS } from "../types";

/* --------------------------- Template loading --------------------------- */

export function loadTemplate(templateId: string | null): SrgTemplate | null {
  return getTemplate(templateId);
}

export function listAvailableTemplates(): SrgTemplate[] {
  return getTemplate(null) ? [] : []; // not used; use listTemplates()
}

/* --------------------------- Conditional evaluation --------------------------- */

/**
 * Evaluate whether a question should be visible based on its `showIf`
 * conditions. All conditions must be satisfied (AND logic).
 */
export function evaluateCondition(
  condition: QuestionCondition,
  answers: AnswersMap
): boolean {
  const actual = answers[condition.questionId];
  switch (condition.op) {
    case "eq":
      return actual === condition.value;
    case "neq":
      return actual !== condition.value;
    case "in":
      return Array.isArray(condition.value) && condition.value.includes(actual);
    case "not_in":
      return Array.isArray(condition.value) && !condition.value.includes(actual);
    case "contains":
      return Array.isArray(actual) && actual.includes(condition.value);
    case "gt":
      return typeof actual === "number" && actual > (condition.value as number);
    case "lt":
      return typeof actual === "number" && actual < (condition.value as number);
    case "truthy":
      if (typeof actual === "boolean") return actual === condition.value;
      if (Array.isArray(actual)) return actual.length > 0 === Boolean(condition.value);
      if (typeof actual === "string") return actual.length > 0 === Boolean(condition.value);
      return Boolean(actual) === Boolean(condition.value);
    default:
      return true;
  }
}

export function isQuestionVisible(
  question: SrgQuestion,
  answers: AnswersMap
): boolean {
  if (!question.showIf || question.showIf.length === 0) return true;
  return question.showIf.every((c) => evaluateCondition(c, answers));
}

export function isSectionVisible(
  section: SrgSection,
  answers: AnswersMap
): boolean {
  if (!section.showIf || section.showIf.length === 0) return true;
  return section.showIf.every((c) => evaluateCondition(c, answers));
}

/**
 * Get all visible questions across all visible sections of a template.
 * Used for progress calculation and dynamic schema building.
 */
export function getVisibleQuestions(
  template: SrgTemplate,
  answers: AnswersMap
): { section: SrgSection; question: SrgQuestion }[] {
  const result: { section: SrgSection; question: SrgQuestion }[] = [];
  template.sections.forEach((section) => {
    if (!isSectionVisible(section, answers)) return;
    section.questions.forEach((question) => {
      if (isQuestionVisible(question, answers)) {
        result.push({ section, question });
      }
    });
  });
  return result;
}

/* --------------------------- Dynamic schema builder --------------------------- */

/**
 * Build a Zod schema for the dynamic SRG questions based on the
 * template's visible questions and the current answers (which
 * determine visibility of conditionally-shown required questions).
 */
export function buildAnswersSchema(
  template: SrgTemplate,
  answers: AnswersMap
): z.ZodType<AnswersMap> {
  const visible = getVisibleQuestions(template, answers);
  const shape: Record<string, z.ZodTypeAny> = {};

  visible.forEach(({ question }) => {
    let fieldSchema: z.ZodTypeAny;

    switch (question.type) {
      case "email":
        fieldSchema = z.string().email("Enter a valid email");
        break;
      case "number":
        fieldSchema = z.coerce.number({
          errorMap: () => ({ message: "Enter a number" }),
        });
        if (question.min != null)
          fieldSchema = (fieldSchema as z.ZodNumber).min(question.min, `Minimum ${question.min}`);
        if (question.max != null)
          fieldSchema = (fieldSchema as z.ZodNumber).max(question.max, `Maximum ${question.max}`);
        break;
      case "url":
        fieldSchema = z.string().url("Enter a valid URL");
        break;
      case "boolean":
        fieldSchema = z.boolean();
        break;
      case "multiselect":
      case "checkbox":
        fieldSchema = z.array(z.string());
        break;
      case "rating":
      case "scale":
        fieldSchema = z.coerce.number().min(1).max(question.scale ?? 5);
        break;
      case "select":
      case "radio":
        fieldSchema = z.string();
        break;
      case "textarea":
      case "text":
      case "tel":
      case "date":
      default:
        fieldSchema = z.string();
        if (question.maxLength)
          fieldSchema = (fieldSchema as z.ZodString).max(
            question.maxLength,
            `Maximum ${question.maxLength} characters`
          );
        break;
    }

    if (question.required) {
      // for strings, require non-empty
      if (fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(1, `${question.label} is required`);
      } else if (fieldSchema instanceof z.ZodArray) {
        fieldSchema = fieldSchema.min(1, "Select at least one option");
      } else if (fieldSchema instanceof z.ZodNumber) {
        // already covered by min()
      } else if (fieldSchema instanceof z.ZodBoolean) {
        fieldSchema = fieldSchema.refine((v) => v === true, {
          message: `${question.label} is required`,
        });
      }
    } else {
      fieldSchema = fieldSchema.optional().or(fieldSchema);
    }

    shape[question.id] = fieldSchema;
  });

  return z.object(shape) as unknown as z.ZodType<AnswersMap>;
}

/* --------------------------- Progress tracking --------------------------- */

export function computeProgress(session: SrgSession): {
  totalSteps: number;
  currentStep: number;
  completion: number; // 0-100
} {
  const totalSteps = SRG_STEPS.length;
  const currentStep = session.currentStep + 1; // 1-indexed for display
  // base completion from step position
  const stepCompletion = (session.currentStep / totalSteps) * 100;

  // completion bonus for filled-in data within the current step
  let dataBonus = 0;
  const template = loadTemplate(session.selectedTemplateId);
  if (template && session.currentStep === 4) {
    // step 5: dynamic questions
    const visible = getVisibleQuestions(template, session.answers);
    const requiredVisible = visible.filter(({ question }) => question.required);
    const answeredRequired = requiredVisible.filter(
      ({ question }) => {
        const v = session.answers[question.id];
        if (Array.isArray(v)) return v.length > 0;
        return v !== undefined && v !== null && v !== "";
      }
    ).length;
    const ratio = requiredVisible.length > 0 ? answeredRequired / requiredVisible.length : 0;
    dataBonus = (1 / totalSteps) * 100 * ratio;
  }

  const completion = Math.min(100, Math.round(stepCompletion + dataBonus));
  return { totalSteps, currentStep, completion };
}

/* --------------------------- Data normalization --------------------------- */

/**
 * Normalize raw answers before submission. Coerces types, trims strings,
 * drops empty arrays, and omits answers for questions that are no longer
 * visible (because their parent conditions became false).
 */
export function normalizeAnswers(
  template: SrgTemplate,
  raw: AnswersMap
): AnswersMap {
  const visible = getVisibleQuestions(template, raw);
  const visibleIds = new Set(visible.map(({ question }) => question.id));
  const normalized: AnswersMap = {};

  visible.forEach(({ question }) => {
    const v = raw[question.id];
    if (v === undefined || v === null) return;

    switch (question.type) {
      case "text":
      case "textarea":
      case "email":
      case "tel":
      case "url":
      case "date":
      case "select":
      case "radio":
        if (typeof v === "string") {
          const trimmed = v.trim();
          if (trimmed.length > 0) normalized[question.id] = trimmed;
        }
        break;
      case "number":
      case "rating":
      case "scale":
        if (typeof v === "number" && !isNaN(v)) normalized[question.id] = v;
        else if (typeof v === "string" && v.trim() !== "") {
          const n = Number(v);
          if (!isNaN(n)) normalized[question.id] = n;
        }
        break;
      case "boolean":
        if (typeof v === "boolean") normalized[question.id] = v;
        break;
      case "multiselect":
      case "checkbox":
        if (Array.isArray(v) && v.length > 0) {
          normalized[question.id] = v.filter((x) => typeof x === "string" && x.length > 0);
        }
        break;
      default:
        if (v !== "" && v !== null) normalized[question.id] = v;
    }
    // omit if outside visible set
    if (!visibleIds.has(question.id)) {
      delete normalized[question.id];
    }
  });

  return normalized;
}

/* --------------------------- Submission payload builder --------------------------- */

const SCHEMA_VERSION = "1.0.0";

/**
 * Build the final submission payload. This is the canonical shape that
 * will be POSTed to the Django backend once integrated. Until then, it
 * is generated entirely in the browser and can be downloaded as JSON
 * for review / hand-off.
 *
 * File objects cannot be JSON-serialized. We include a small preview
 * data URL for images (<=2MB) so the backend can render thumbnails
 * without round-tripping. Actual files will be uploaded separately
 * via the uploadFiles() service.
 */
export async function buildSubmissionPayload(
  session: SrgSession
): Promise<SrgSubmissionPayload> {
  const template = loadTemplate(session.selectedTemplateId);
  if (!template) {
    throw new Error("Cannot build payload: no template selected");
  }

  const normalizedAnswers = normalizeAnswers(template, session.answers);
  const progress = computeProgress(session);

  // strip File objects and add preview data URLs for small images
  const uploads = await Promise.all(
    session.uploads.map(async (u) => {
      let previewDataUrl: string | null = null;
      if (u.previewUrl && u.type.startsWith("image/") && u.size <= 2 * 1024 * 1024) {
        try {
          previewDataUrl = await fileToDataUrl(u.file);
        } catch {
          previewDataUrl = null;
        }
      }
      const { file: _f, previewUrl: _p, ...rest } = u;
      void _f;
      void _p;
      return { ...rest, previewDataUrl };
    })
  );

  return {
    sessionId: session.sessionId,
    templateId: template.id,
    clientDetails: session.clientDetails,
    businessDetails: session.businessDetails,
    projectType: session.projectType,
    projectGoals: session.projectGoals,
    answers: normalizedAnswers,
    uploads,
    teamRoles: session.teamRoles,
    workflow: session.workflow,
    progress,
    submittedAt: Date.now(),
    schemaVersion: SCHEMA_VERSION,
  };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* --------------------------- Workflow helpers --------------------------- */

export const WORKFLOW_FLOW_META: Record<
  WorkflowFlowType,
  { label: string; description: string; icon: string }
> = {
  customer: {
    label: "Customer Flow",
    description: "End-to-end journey of your customer / end-user",
    icon: "UserCheck",
  },
  approval: {
    label: "Approval Flow",
    description: "Multi-level approval chains for actions / documents",
    icon: "CheckSquare",
  },
  verification: {
    label: "Verification Flow",
    description: "KYC, document verification, eligibility checks",
    icon: "ShieldCheck",
  },
  payment: {
    label: "Payment Flow",
    description: "Payment initiation, processing, reconciliation",
    icon: "CreditCard",
  },
  reporting: {
    label: "Reporting Flow",
    description: "Data aggregation, report generation, distribution",
    icon: "BarChart3",
  },
  staff: {
    label: "Staff Flow",
    description: "Internal staff workflows and task management",
    icon: "Users",
  },
};

/* --------------------------- Validation summary --------------------------- */

export interface StepValidationResult {
  ok: boolean;
  errors: Record<string, string>;
}

/**
 * Validate the current step's data. Returns a flat map of field -> error.
 * Empty map = step is valid.
 */
export function validateStep(
  step: number,
  session: SrgSession
): StepValidationResult {
  const errors: Record<string, string> = {};

  switch (step) {
    case 0: {
      // client info
      const r = requireFields(session.clientDetails, [
        "fullName",
        "email",
        "phone",
        "company",
        "country",
        "timezone",
        "preferredContact",
      ]);
      Object.assign(errors, r);
      if (
        !errors.email &&
        session.clientDetails.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(session.clientDetails.email)
      ) {
        errors.email = "Enter a valid email address";
      }
      break;
    }
    case 1: {
      Object.assign(
        errors,
        requireFields(session.businessDetails, [
          "legalName",
          "industry",
          "size",
          "stage",
          "annualBudget",
          "targetLaunch",
        ])
      );
      if (
        !errors.website &&
        session.businessDetails.website &&
        !/^https?:\/\/.+\..+/.test(session.businessDetails.website)
      ) {
        errors.website = "Enter a valid URL (https://...)";
      }
      break;
    }
    case 2: {
      if (!session.selectedTemplateId) errors.template = "Select a project template";
      if (!session.projectType) errors.projectType = "Select a project type";
      break;
    }
    case 3: {
      Object.assign(
        errors,
        requireFields(session.projectGoals, [
          "primaryGoal",
          "successMetrics",
          "deadline",
          "budgetRange",
        ])
      );
      if (
        !errors.primaryGoal &&
        session.projectGoals.primaryGoal &&
        session.projectGoals.primaryGoal.length < 8
      ) {
        errors.primaryGoal = "Describe your primary goal in at least 8 characters";
      }
      break;
    }
    case 4: {
      const template = loadTemplate(session.selectedTemplateId);
      if (template) {
        const visible = getVisibleQuestions(template, session.answers);
        visible.forEach(({ question }) => {
          if (!question.required) return;
          const v = session.answers[question.id];
          const empty =
            v === undefined ||
            v === null ||
            v === "" ||
            (Array.isArray(v) && v.length === 0);
          if (empty) {
            errors[question.id] = `${question.label} is required`;
          }
        });
      }
      break;
    }
    case 5: {
      // uploads — check required upload requirements
      const template = loadTemplate(session.selectedTemplateId);
      if (template) {
        template.uploadRequirements.forEach((req, idx) => {
          if (!req.required) return;
          const hasFile = session.uploads.some(
            (u) => u.category === req.category && u.status !== "rejected"
          );
          if (!hasFile) {
            errors[`upload_${idx}`] = `${req.label} is required`;
          }
        });
      }
      break;
    }
    case 6: {
      // team roles — at least one role with valid email
      const validRoles = session.teamRoles.filter(
        (r) =>
          r.name.trim() &&
          r.email.trim() &&
          r.role.trim() &&
          r.department.trim()
      );
      if (validRoles.length === 0) {
        errors.team = "Add at least one team member";
      }
      validRoles.forEach((r, i) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) {
          errors[`role_${i}_email`] = "Invalid email";
        }
      });
      break;
    }
    case 7: {
      // workflow — each enabled flow needs at least 1 stage
      Object.entries(session.workflow).forEach(([flow, data]) => {
        if (data.enabled && data.stages.length === 0) {
          errors[`flow_${flow}`] = `${data.label} needs at least 1 stage`;
        }
      });
      break;
    }
    case 8: {
      // final review — no validation, just confirmation
      break;
    }
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

function requireFields<T extends Record<string, unknown>>(
  obj: T,
  fields: (keyof T)[]
): Record<string, string> {
  const errors: Record<string, string> = {};
  fields.forEach((f) => {
    const v = obj[f];
    const empty =
      v === undefined ||
      v === null ||
      v === "" ||
      (Array.isArray(v) && v.length === 0);
    if (empty) errors[f as string] = "This field is required";
  });
  return errors;
}
