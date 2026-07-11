/**
 * Django API Connector Layer
 * --------------------------
 * Stub services for future Django REST Framework integration.
 *
 * IMPORTANT: The frontend currently runs fully without a backend.
 * These functions are wired into the SRGContext but degrade
 * gracefully — they attempt a network call, and on failure fall
 * back to local handling. The Django backend, when available,
 * will handle:
 *
 *   - Database persistence
 *   - Authentication & authorization
 *   - File storage (S3 / local media)
 *   - Email / SMS notifications
 *   - Admin access
 *   - CRM sync
 *   - Quotation generation
 *
 * The frontend JavaScript runtime (state, validation, draft autosave,
 * uploads queue, workflow builder) REMAINS IN PRODUCTION even after
 * Django integration. Django is the system of record; the runtime
 * is the system of interaction.
 */

const API_BASE = process.env.NEXT_PUBLIC_SRG_API_BASE ?? "";
const API_TIMEOUT_MS = 12000;

export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  status: number;
  /** true if the call was served from local fallback */
  local: boolean;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  if (!API_BASE) {
    // No backend configured — local fallback
    return {
      ok: false,
      status: 0,
      error: "No backend configured — running in local-only mode",
      local: true,
    };
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });
    clearTimeout(timeout);
    const data = (await res.json().catch(() => null)) as T;
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: (data as { detail?: string })?.detail ?? `HTTP ${res.status}`,
        local: false,
      };
    }
    return { ok: true, status: res.status, data, local: false };
  } catch (e) {
    return {
      ok: false,
      status: 0,
      error: e instanceof Error ? e.message : "Network error",
      local: true,
    };
  }
}

/* --------------------------- Templates --------------------------- */

/**
 * Future: fetch template list from Django (with per-user customization).
 * Today: served from frontend template registry.
 */
export async function getTemplates(): Promise<
  ApiResult<{ id: string; name: string; description: string }[]>
> {
  return request("/api/srg/templates/");
}

/* --------------------------- Submission --------------------------- */

/**
 * Future: POST the final submission payload to Django.
 * Django will persist to DB, trigger notifications, sync CRM,
 * and generate a quotation.
 *
 * Today: returns ok=false with local=true. The SRGContext handles
 * this by marking the submission as "pending sync" locally.
 */
export async function submitSRG(
  payload: unknown
): Promise<ApiResult<{ submissionId: string; quotationId?: string }>> {
  return request("/api/srg/submissions/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* --------------------------- File uploads --------------------------- */

/**
 * Future: upload files to Django (which routes them to S3).
 * Django returns a signed URL + file ID for each upload.
 *
 * Today: returns ok=false with local=true. Files remain in browser
 * memory until the user submits and the Django sync is performed.
 */
export async function uploadFiles(
  sessionId: string,
  files: { id: string; file: File; category: string }[]
): Promise<
  ApiResult<{ uploaded: { id: string; remoteUrl: string; fileId: string }[] }>
> {
  if (!API_BASE) {
    return {
      ok: false,
      status: 0,
      error: "File uploads require backend configuration",
      local: true,
    };
  }
  // Real implementation would use FormData/multipart
  const formData = new FormData();
  formData.append("sessionId", sessionId);
  files.forEach((f, i) => {
    formData.append(`file_${i}`, f.file);
    formData.append(`meta_${i}`, JSON.stringify({ id: f.id, category: f.category }));
  });
  try {
    const res = await fetch(`${API_BASE}/api/srg/uploads/`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return {
      ok: res.ok,
      status: res.status,
      data,
      error: res.ok ? undefined : `HTTP ${res.status}`,
      local: false,
    };
  } catch (e) {
    return {
      ok: false,
      status: 0,
      error: e instanceof Error ? e.message : "Upload failed",
      local: true,
    };
  }
}

/* --------------------------- Draft sync --------------------------- */

/**
 * Future: sync draft state to Django so the user can resume
 * on another device. Today: no-op (local storage only).
 */
export async function syncDraft(
  sessionId: string,
  draft: unknown
): Promise<ApiResult<{ synced: boolean }>> {
  return request(`/api/srg/drafts/${sessionId}/`, {
    method: "PUT",
    body: JSON.stringify(draft),
  });
}

/* --------------------------- Auth --------------------------- */

/**
 * Future: authenticate the client before they can submit.
 * Today: SRG is open for any visitor; submission triggers an
 * email-based verification flow.
 */
export async function authenticateClient(
  email: string,
  otp: string
): Promise<ApiResult<{ token: string; clientId: string }>> {
  return request("/api/auth/client/", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

/* --------------------------- Quotation --------------------------- */

/**
 * Future: after submission, Django generates a quotation based on
 * the project type, scope, and selected modules. The frontend
 * polls this endpoint to display the quotation inline.
 */
export async function getQuotation(
  submissionId: string
): Promise<
  ApiResult<{
    quotationId: string;
    totalAmount: number;
    currency: string;
    lineItems: { label: string; amount: number }[];
    validUntil: string;
  }>
> {
  return request(`/api/srg/quotations/${submissionId}/`);
}
