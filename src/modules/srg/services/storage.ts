/**
 * Local Storage Engine
 * --------------------
 * Persistent in-browser storage for the SRG runtime. Handles:
 *   - Saving and restoring the full session state
 *   - Auto-save (called every 10s by useAutoSave hook)
 *   - Draft recovery after page refresh
 *   - Upload metadata persistence (File objects cannot be serialized,
 *     so we persist metadata only and mark uploads as "needs re-upload"
 *     on restore)
 *   - Multiple sessions (one per browser, keyed by sessionId)
 *
 * No backend involved. Pure browser runtime.
 */
import type {
  SrgSession,
  UploadFileMeta,
  WorkflowMap,
  WorkflowFlowType,
} from "../types";

const STORAGE_KEY = "mbtech.srg.session.v1";
const SESSIONS_INDEX_KEY = "mbtech.srg.sessions.index.v1";

/** Safe JSON parse with fallback */
function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Strip File objects (non-serializable) and preview URLs (revoked on reload) */
function serializeSession(session: SrgSession): string {
  const serializableUploads: Array<
    Omit<UploadFileMeta, "file" | "previewUrl"> & {
      __fileLost: true;
      __previewLost: true;
    }
  > = session.uploads.map((u) => {
    const { file: _f, previewUrl: _p, ...rest } = u;
    void _f;
    void _p;
    return {
      ...rest,
      __fileLost: true as const,
      __previewLost: true as const,
      status: "queued" as const,
      error: "File needs re-upload after refresh",
    };
  });

  return JSON.stringify({
    ...session,
    uploads: serializableUploads,
  });
}

/** On restore, reconstitute UploadFileMeta without the File object */
function deserializeSession(raw: string): SrgSession | null {
  const parsed = safeParse<Record<string, unknown> | null>(raw, null);
  if (!parsed || typeof parsed !== "object") return null;
  const uploads = Array.isArray((parsed as { uploads?: unknown }).uploads)
    ? ((parsed as { uploads: Array<Record<string, unknown>> }).uploads).map(
        (u): UploadFileMeta => ({
          id: String(u.id ?? ""),
          // File cannot be restored — placeholder Blob is non-functional
          // but keeps TypeScript happy. The UI will force re-upload.
          file: new File([""], u.name ? String(u.name) : "lost-file", {
            type: u.type ? String(u.type) : "application/octet-stream",
          }),
          name: String(u.name ?? ""),
          size: Number(u.size ?? 0),
          type: String(u.type ?? ""),
          category: (u.category as UploadFileMeta["category"]) ?? "documents",
          previewUrl: null,
          status: "queued",
          error: "File needs re-upload after refresh",
          uploadedAt: Number(u.uploadedAt ?? Date.now()),
          width: u.width ? Number(u.width) : undefined,
          height: u.height ? Number(u.height) : undefined,
          durationSec: u.durationSec ? Number(u.durationSec) : undefined,
          pageCount: u.pageCount ? Number(u.pageCount) : undefined,
          lastModified: u.lastModified ? Number(u.lastModified) : undefined,
        })
      )
    : [];

  return {
    ...(parsed as unknown as SrgSession),
    uploads,
  };
}

/* --------------------------- Public API --------------------------- */

export function saveSession(session: SrgSession): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, serializeSession(session));
    // Update sessions index (just IDs + timestamps for now)
    const index = safeParse<
      Array<{ sessionId: string; updatedAt: number; templateId: string | null }>
    >(localStorage.getItem(SESSIONS_INDEX_KEY), []);
    const existing = index.findIndex((i) => i.sessionId === session.sessionId);
    const entry = {
      sessionId: session.sessionId,
      updatedAt: Date.now(),
      templateId: session.selectedTemplateId,
    };
    if (existing >= 0) {
      index[existing] = entry;
    } else {
      index.push(entry);
    }
    // Keep only the 10 most recent
    index.sort((a, b) => b.updatedAt - a.updatedAt);
    localStorage.setItem(SESSIONS_INDEX_KEY, JSON.stringify(index.slice(0, 10)));
    return true;
  } catch (e) {
    // Quota exceeded or storage disabled
    console.warn("[SRG] Failed to save session:", e);
    return false;
  }
}

export function loadSession(): SrgSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return deserializeSession(raw);
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function hasDraftSession(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(STORAGE_KEY);
}

export function getDraftAge(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed = safeParse<{ updatedAt?: number } | null>(raw, null);
  if (!parsed?.updatedAt) return null;
  return Date.now() - parsed.updatedAt;
}

/* --------------------------- Workflow defaults --------------------------- */

export function buildDefaultWorkflow(
  requirements: { flow: WorkflowFlowType; label: string; defaultStages?: string[] }[]
): WorkflowMap {
  const flows: WorkflowMap["customer"]["type"] extends never ? never : Record<
    WorkflowFlowType,
    WorkflowMap[WorkflowFlowType]
  > = {} as WorkflowMap;
  // initialize all flows as disabled with empty stages
  const ALL_FLOWS: WorkflowFlowType[] = [
    "customer",
    "approval",
    "verification",
    "payment",
    "reporting",
    "staff",
  ];
  const LABELS: Record<WorkflowFlowType, string> = {
    customer: "Customer Flow",
    approval: "Approval Flow",
    verification: "Verification Flow",
    payment: "Payment Flow",
    reporting: "Reporting Flow",
    staff: "Staff Flow",
  };
  ALL_FLOWS.forEach((f) => {
    flows[f] = {
      type: f,
      label: LABELS[f],
      enabled: false,
      stages: [],
    };
  });
  // apply template defaults
  requirements.forEach((r) => {
    flows[r.flow] = {
      type: r.flow,
      label: r.label,
      enabled: r.defaultStages && r.defaultStages.length > 0,
      stages: (r.defaultStages ?? []).map((name, idx) => ({
        id: `${r.flow}-stage-${idx}-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .slice(2, 6)}`,
        name,
        description: "",
        owner: "",
        slaHours: 24,
      })),
    };
  });
  return flows as WorkflowMap;
}

/* --------------------------- Session factory --------------------------- */

export function createNewSession(): SrgSession {
  const now = Date.now();
  const sessionId = `srg_${now.toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
  return {
    sessionId,
    startedAt: now,
    updatedAt: now,
    currentStep: 0,
    selectedTemplateId: null,
    clientDetails: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      country: "",
      timezone: "",
      preferredContact: "",
    },
    businessDetails: {
      legalName: "",
      industry: "",
      size: "",
      website: "",
      stage: "",
      annualBudget: "",
      targetLaunch: "",
      existingStack: "",
      competitors: "",
    },
    projectType: "",
    projectGoals: {
      primaryGoal: "",
      secondaryGoals: [],
      successMetrics: "",
      priorities: {
        speed: 3,
        cost: 3,
        quality: 4,
        scalability: 4,
        innovation: 3,
      },
      deadline: "",
      budgetRange: "",
    },
    answers: {},
    uploads: [],
    teamRoles: [],
    workflow: {} as WorkflowMap,
    submitted: false,
    submittedAt: null,
    submissionId: null,
  };
}
