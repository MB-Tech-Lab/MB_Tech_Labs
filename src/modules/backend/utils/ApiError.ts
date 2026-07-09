/**
 * API Error Class
 * ---------------
 * Framework-agnostic. Used by services, caught by API route handlers.
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, "BAD_REQUEST", message, details);
  }
  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, "UNAUTHORIZED", message);
  }
  static forbidden(message = "Forbidden") {
    return new ApiError(403, "FORBIDDEN", message);
  }
  static notFound(message = "Not found") {
    return new ApiError(404, "NOT_FOUND", message);
  }
  static conflict(message: string) {
    return new ApiError(409, "CONFLICT", message);
  }
  static unprocessable(message: string, details?: unknown) {
    return new ApiError(422, "UNPROCESSABLE_ENTITY", message, details);
  }
  static internal(message = "Internal server error") {
    return new ApiError(500, "INTERNAL_ERROR", message);
  }
}

/**
 * Standard API response helper for Next.js API routes.
 */
export function apiResponse<T>(data: T, status = 200): Response {
  return Response.json({ success: true, data }, { status });
}

export function apiError(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        },
      },
      { status: error.statusCode }
    );
  }
  // Zod errors
  if (error && typeof error === "object" && "errors" in error) {
    return Response.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: (error as { errors: unknown[] }).errors,
        },
      },
      { status: 422 }
    );
  }
  console.error("[API] Unhandled error:", error);
  return Response.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message:
          process.env.NODE_ENV === "production"
            ? "Internal server error"
            : (error as Error)?.message || "Unknown error",
      },
    },
    { status: 500 }
  );
}
