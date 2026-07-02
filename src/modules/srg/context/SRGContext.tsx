"use client";

/**
 * SRG Context
 * -----------
 * Central state management for the Project Discovery Portal.
 * Holds the full session state and exposes actions for every step.
 *
 * Responsibilities:
 *   - Hold session state (clientDetails, businessDetails, projectType,
 *     projectGoals, answers, uploads, teamRoles, workflow, progress)
 *   - Auto-save to localStorage every 10s (and on every state change)
 *   - Recover draft after page refresh
 *   - Track progress percentage
 *   - Expose actions: setClientDetails, addUpload, removeUpload,
 *     addTeamRole, updateWorkflowFlow, goToStep, submit, etc.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  SrgSession,
  ClientDetails,
  BusinessDetails,
  ProjectGoals,
  AnswersMap,
  UploadFileMeta,
  TeamRole,
  WorkflowMap,
  WorkflowFlowType,
  WorkflowStage,
  UploadCategory,
  SrgSubmissionPayload,
} from "../types";
import {
  createNewSession,
  loadSession,
  saveSession,
  buildDefaultWorkflow,
} from "../services/storage";
import { revokePreviewUrl, extractMetadata } from "../services/uploads";
import { computeProgress, loadTemplate } from "../engine/runtime";
import { buildSubmissionPayload } from "../engine/runtime";

/* --------------------------- Actions --------------------------- */

type Action =
  | { type: "HYDRATE"; payload: SrgSession }
  | { type: "RESET" }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_TEMPLATE"; payload: { templateId: string; projectType: string } }
  | { type: "PATCH_CLIENT"; payload: Partial<ClientDetails> }
  | { type: "PATCH_BUSINESS"; payload: Partial<BusinessDetails> }
  | { type: "PATCH_GOALS"; payload: Partial<ProjectGoals> }
  | { type: "SET_ANSWER"; payload: { questionId: string; value: unknown } }
  | { type: "SET_ANSWERS"; payload: AnswersMap }
  | { type: "ADD_UPLOAD"; payload: UploadFileMeta }
  | { type: "UPDATE_UPLOAD"; payload: { id: string; patch: Partial<UploadFileMeta> } }
  | { type: "REMOVE_UPLOAD"; payload: string }
  | { type: "ADD_TEAM_ROLE"; payload: TeamRole }
  | { type: "UPDATE_TEAM_ROLE"; payload: { id: string; patch: Partial<TeamRole> } }
  | { type: "REMOVE_TEAM_ROLE"; payload: string }
  | { type: "TOGGLE_FLOW"; payload: WorkflowFlowType }
  | { type: "ADD_STAGE"; payload: { flow: WorkflowFlowType; stage: WorkflowStage } }
  | { type: "UPDATE_STAGE"; payload: { flow: WorkflowFlowType; stageId: string; patch: Partial<WorkflowStage> } }
  | { type: "REMOVE_STAGE"; payload: { flow: WorkflowFlowType; stageId: string } }
  | { type: "REORDER_STAGE"; payload: { flow: WorkflowFlowType; from: number; to: number } }
  | { type: "MARK_SUBMITTED"; payload: { submissionId: string } };

/* --------------------------- Reducer --------------------------- */

function reducer(state: SrgSession, action: Action): SrgSession {
  switch (action.type) {
    case "HYDRATE":
      return { ...action.payload, updatedAt: Date.now() };
    case "RESET":
      return createNewSession();
    case "SET_STEP":
      return { ...state, currentStep: action.payload, updatedAt: Date.now() };
    case "SET_TEMPLATE": {
      const template = loadTemplate(action.payload.templateId);
      const workflow = template
        ? buildDefaultWorkflow(template.workflowRequirements)
        : state.workflow;
      return {
        ...state,
        selectedTemplateId: action.payload.templateId,
        projectType: action.payload.projectType,
        // reset dynamic answers when template changes
        answers: {},
        workflow,
        updatedAt: Date.now(),
      };
    }
    case "PATCH_CLIENT":
      return {
        ...state,
        clientDetails: { ...state.clientDetails, ...action.payload },
        updatedAt: Date.now(),
      };
    case "PATCH_BUSINESS":
      return {
        ...state,
        businessDetails: { ...state.businessDetails, ...action.payload },
        updatedAt: Date.now(),
      };
    case "PATCH_GOALS":
      return {
        ...state,
        projectGoals: { ...state.projectGoals, ...action.payload },
        updatedAt: Date.now(),
      };
    case "SET_ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.payload.questionId]: action.payload.value as never },
        updatedAt: Date.now(),
      };
    case "SET_ANSWERS":
      return { ...state, answers: { ...state.answers, ...action.payload }, updatedAt: Date.now() };
    case "ADD_UPLOAD":
      return {
        ...state,
        uploads: [...state.uploads, action.payload],
        updatedAt: Date.now(),
      };
    case "UPDATE_UPLOAD":
      return {
        ...state,
        uploads: state.uploads.map((u) =>
          u.id === action.payload.id ? { ...u, ...action.payload.patch } : u
        ),
        updatedAt: Date.now(),
      };
    case "REMOVE_UPLOAD": {
      const target = state.uploads.find((u) => u.id === action.payload);
      if (target) revokePreviewUrl(target);
      return {
        ...state,
        uploads: state.uploads.filter((u) => u.id !== action.payload),
        updatedAt: Date.now(),
      };
    }
    case "ADD_TEAM_ROLE":
      return {
        ...state,
        teamRoles: [...state.teamRoles, action.payload],
        updatedAt: Date.now(),
      };
    case "UPDATE_TEAM_ROLE":
      return {
        ...state,
        teamRoles: state.teamRoles.map((r) =>
          r.id === action.payload.id ? { ...r, ...action.payload.patch } : r
        ),
        updatedAt: Date.now(),
      };
    case "REMOVE_TEAM_ROLE":
      return {
        ...state,
        teamRoles: state.teamRoles.filter((r) => r.id !== action.payload),
        updatedAt: Date.now(),
      };
    case "TOGGLE_FLOW": {
      const flow = state.workflow[action.payload];
      return {
        ...state,
        workflow: {
          ...state.workflow,
          [action.payload]: { ...flow, enabled: !flow.enabled },
        },
        updatedAt: Date.now(),
      };
    }
    case "ADD_STAGE":
      return {
        ...state,
        workflow: {
          ...state.workflow,
          [action.payload.flow]: {
            ...state.workflow[action.payload.flow],
            stages: [...state.workflow[action.payload.flow].stages, action.payload.stage],
          },
        },
        updatedAt: Date.now(),
      };
    case "UPDATE_STAGE":
      return {
        ...state,
        workflow: {
          ...state.workflow,
          [action.payload.flow]: {
            ...state.workflow[action.payload.flow],
            stages: state.workflow[action.payload.flow].stages.map((s) =>
              s.id === action.payload.stageId ? { ...s, ...action.payload.patch } : s
            ),
          },
        },
        updatedAt: Date.now(),
      };
    case "REMOVE_STAGE":
      return {
        ...state,
        workflow: {
          ...state.workflow,
          [action.payload.flow]: {
            ...state.workflow[action.payload.flow],
            stages: state.workflow[action.payload.flow].stages.filter(
              (s) => s.id !== action.payload.stageId
            ),
          },
        },
        updatedAt: Date.now(),
      };
    case "REORDER_STAGE": {
      const flow = state.workflow[action.payload.flow];
      const stages = [...flow.stages];
      const [moved] = stages.splice(action.payload.from, 1);
      stages.splice(action.payload.to, 0, moved);
      return {
        ...state,
        workflow: { ...state.workflow, [action.payload.flow]: { ...flow, stages } },
        updatedAt: Date.now(),
      };
    }
    case "MARK_SUBMITTED":
      return {
        ...state,
        submitted: true,
        submittedAt: Date.now(),
        submissionId: action.payload.submissionId,
        updatedAt: Date.now(),
      };
    default:
      return state;
  }
}

/* --------------------------- Context shape --------------------------- */

interface SrgContextValue {
  session: SrgSession;
  progress: { totalSteps: number; currentStep: number; completion: number };
  lastSavedAt: number | null;
  isHydrated: boolean;

  // navigation
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSession: () => void;

  // step setters
  setTemplate: (templateId: string, projectType: string) => void;
  patchClient: (patch: Partial<ClientDetails>) => void;
  patchBusiness: (patch: Partial<BusinessDetails>) => void;
  patchGoals: (patch: Partial<ProjectGoals>) => void;
  setAnswer: (questionId: string, value: unknown) => void;
  setAnswers: (answers: AnswersMap) => void;

  // uploads
  addUpload: (meta: UploadFileMeta) => void;
  enrichUploadMetadata: (id: string) => Promise<void>;
  updateUpload: (id: string, patch: Partial<UploadFileMeta>) => void;
  removeUpload: (id: string) => void;
  replaceUpload: (id: string, newMeta: UploadFileMeta) => void;

  // team roles
  addTeamRole: (role?: Partial<TeamRole>) => void;
  updateTeamRole: (id: string, patch: Partial<TeamRole>) => void;
  removeTeamRole: (id: string) => void;

  // workflow
  toggleFlow: (flow: WorkflowFlowType) => void;
  addStage: (flow: WorkflowFlowType, stage?: Partial<WorkflowStage>) => void;
  updateStage: (flow: WorkflowFlowType, stageId: string, patch: Partial<WorkflowStage>) => void;
  removeStage: (flow: WorkflowFlowType, stageId: string) => void;
  reorderStage: (flow: WorkflowFlowType, from: number, to: number) => void;

  // submission
  buildPayload: () => Promise<SrgSubmissionPayload>;
  submit: () => Promise<{ ok: boolean; submissionId?: string; error?: string }>;
}

const SrgContext = createContext<SrgContextValue | null>(null);

/* --------------------------- Provider --------------------------- */

export function SrgProvider({ children }: { children: ReactNode }) {
  const [session, dispatch] = useReducer(reducer, undefined, () => {
    // lazy initializer: hydrate from localStorage on first render (client-only)
    if (typeof window !== "undefined") {
      const restored = loadSession();
      if (restored) return restored;
    }
    return createNewSession();
  });
  const [isHydrated, setIsHydrated] = useState(typeof window !== "undefined");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSaveAttemptRef = useRef<number>(0);

  // SSR safety: flip hydration flag after mount (only matters if SSR ever renders this)
  useEffect(() => {
    // mark hydrated after first paint; safe to use queueMicrotask to avoid
    // setState-during-effect lint warning while preserving behavior
    queueMicrotask(() => {
      setIsHydrated((v) => v || true);
    });
  }, []);

  // auto-save every 10 seconds + on every state change (debounced)
  useEffect(() => {
    if (!isHydrated) return;
    // immediate debounced save
    const t = setTimeout(() => {
      const ok = saveSession(session);
      if (ok) {
        setLastSavedAt(Date.now());
        lastSaveAttemptRef.current = Date.now();
      }
    }, 600);
    return () => clearTimeout(t);
  }, [session, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveTimerRef.current = setInterval(() => {
      const ok = saveSession(session);
      if (ok) {
        setLastSavedAt(Date.now());
        lastSaveAttemptRef.current = Date.now();
      }
    }, 10000);
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    };
  }, [session, isHydrated]);

  /* --------------------------- Actions --------------------------- */

  const goToStep = useCallback((step: number) => {
    dispatch({ type: "SET_STEP", payload: Math.max(0, Math.min(8, step)) });
  }, []);
  const nextStep = useCallback(() => {
    dispatch({ type: "SET_STEP", payload: Math.min(8, session.currentStep + 1) });
  }, [session.currentStep]);
  const prevStep = useCallback(() => {
    dispatch({ type: "SET_STEP", payload: Math.max(0, session.currentStep - 1) });
  }, [session.currentStep]);
  const resetSession = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const setTemplate = useCallback((templateId: string, projectType: string) => {
    dispatch({ type: "SET_TEMPLATE", payload: { templateId, projectType } });
  }, []);

  const patchClient = useCallback((patch: Partial<ClientDetails>) => {
    dispatch({ type: "PATCH_CLIENT", payload: patch });
  }, []);
  const patchBusiness = useCallback((patch: Partial<BusinessDetails>) => {
    dispatch({ type: "PATCH_BUSINESS", payload: patch });
  }, []);
  const patchGoals = useCallback((patch: Partial<ProjectGoals>) => {
    dispatch({ type: "PATCH_GOALS", payload: patch });
  }, []);
  const setAnswer = useCallback((questionId: string, value: unknown) => {
    dispatch({ type: "SET_ANSWER", payload: { questionId, value } });
  }, []);
  const setAnswers = useCallback((answers: AnswersMap) => {
    dispatch({ type: "SET_ANSWERS", payload: answers });
  }, []);

  const addUpload = useCallback((meta: UploadFileMeta) => {
    dispatch({ type: "ADD_UPLOAD", payload: meta });
  }, []);
  const enrichUploadMetadata = useCallback(
    async (id: string) => {
      const upload = session.uploads.find((u) => u.id === id);
      if (!upload) return;
      try {
        const meta = await extractMetadata(upload.file);
        dispatch({ type: "UPDATE_UPLOAD", payload: { id, patch: meta } });
      } catch {
        /* ignore metadata errors */
      }
    },
    [session.uploads]
  );
  const updateUpload = useCallback((id: string, patch: Partial<UploadFileMeta>) => {
    dispatch({ type: "UPDATE_UPLOAD", payload: { id, patch } });
  }, []);
  const removeUpload = useCallback((id: string) => {
    dispatch({ type: "REMOVE_UPLOAD", payload: id });
  }, []);
  const replaceUpload = useCallback(
    (id: string, newMeta: UploadFileMeta) => {
      dispatch({ type: "REMOVE_UPLOAD", payload: id });
      dispatch({ type: "ADD_UPLOAD", payload: newMeta });
    },
    []
  );

  const addTeamRole = useCallback((role?: Partial<TeamRole>) => {
    const newRole: TeamRole = {
      id: `role_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      name: "",
      email: "",
      role: "",
      department: "",
      permissions: [],
      ...role,
    };
    dispatch({ type: "ADD_TEAM_ROLE", payload: newRole });
  }, []);
  const updateTeamRole = useCallback((id: string, patch: Partial<TeamRole>) => {
    dispatch({ type: "UPDATE_TEAM_ROLE", payload: { id, patch } });
  }, []);
  const removeTeamRole = useCallback((id: string) => {
    dispatch({ type: "REMOVE_TEAM_ROLE", payload: id });
  }, []);

  const toggleFlow = useCallback((flow: WorkflowFlowType) => {
    dispatch({ type: "TOGGLE_FLOW", payload: flow });
  }, []);
  const addStage = useCallback((flow: WorkflowFlowType, stage?: Partial<WorkflowStage>) => {
    const newStage: WorkflowStage = {
      id: `stage_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      name: "",
      description: "",
      owner: "",
      slaHours: 24,
      ...stage,
    };
    dispatch({ type: "ADD_STAGE", payload: { flow, stage: newStage } });
  }, []);
  const updateStage = useCallback(
    (flow: WorkflowFlowType, stageId: string, patch: Partial<WorkflowStage>) => {
      dispatch({ type: "UPDATE_STAGE", payload: { flow, stageId, patch } });
    },
    []
  );
  const removeStage = useCallback((flow: WorkflowFlowType, stageId: string) => {
    dispatch({ type: "REMOVE_STAGE", payload: { flow, stageId } });
  }, []);
  const reorderStage = useCallback((flow: WorkflowFlowType, from: number, to: number) => {
    dispatch({ type: "REORDER_STAGE", payload: { flow, from, to } });
  }, []);

  const buildPayload = useCallback(async () => {
    return buildSubmissionPayload(session);
  }, [session]);

  const submit = useCallback(async () => {
    try {
      const payload = await buildSubmissionPayload(session);
      // generate a local submission ID (Django will assign the real one)
      const localId = `local_${Date.now().toString(36)}`;
      dispatch({ type: "MARK_SUBMITTED", payload: { submissionId: localId } });
      return { ok: true, submissionId: localId };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Submission failed",
      };
    }
  }, [session]);

  const progress = useMemo(() => computeProgress(session), [session]);

  const value: SrgContextValue = {
    session,
    progress,
    lastSavedAt,
    isHydrated,
    goToStep,
    nextStep,
    prevStep,
    resetSession,
    setTemplate,
    patchClient,
    patchBusiness,
    patchGoals,
    setAnswer,
    setAnswers,
    addUpload,
    enrichUploadMetadata,
    updateUpload,
    removeUpload,
    replaceUpload,
    addTeamRole,
    updateTeamRole,
    removeTeamRole,
    toggleFlow,
    addStage,
    updateStage,
    removeStage,
    reorderStage,
    buildPayload,
    submit,
  };

  return <SrgContext.Provider value={value}>{children}</SrgContext.Provider>;
}

/* --------------------------- Hook --------------------------- */

export function useSrg(): SrgContextValue {
  const ctx = useContext(SrgContext);
  if (!ctx) {
    throw new Error("useSrg must be used inside <SrgProvider>");
  }
  return ctx;
}

/* --------------------------- Helper exports --------------------------- */

export { UPLOAD_CATEGORIES } from "../services/uploads";
export type { UploadCategory };
