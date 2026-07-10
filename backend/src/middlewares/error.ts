/**
 * Centralized Error Middleware
 * ----------------------------
 * Catches all errors thrown by controllers/services. Returns a clean
 * JSON response with the right HTTP status code. Never exposes
 * internal stack traces in production.
 */
import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { config } from "../config";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation errors → 422
  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      },
    });
    return;
  }

  // Our own API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  // Prisma errors
  if (isPrismaError(err)) {
    const prismaErr = err as { code?: string; message: string };
    if (prismaErr.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT",
          message: "A record with this value already exists",
        },
      });
      return;
    }
    if (prismaErr.code === "P2025") {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Record not found" },
      });
      return;
    }
  }

  // Fallback — 500
  console.error("[ERROR] Unhandled:", err);
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message:
        config.nodeEnv === "production"
          ? "Internal server error"
          : (err as Error)?.message || "Unknown error",
    },
  });
}

function isPrismaError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code: unknown }).code === "string" &&
    (err as { code: string }).code.startsWith("P")
  );
}
