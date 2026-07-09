/**
 * Auth Middleware (Next.js API route version)
 * --------------------------------------------
 * Extracts and verifies JWT from the Authorization header.
 * Returns the authenticated user or throws ApiError.
 *
 * When migrating to Express, this becomes Express middleware
 * that attaches to req.authUser instead of returning.
 */
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function requireAuth(req: NextRequest): AuthUser {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Missing or invalid Authorization header");
  }
  const token = header.slice(7);
  try {
    const payload = verifyAccessToken(token);
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }
}

export function requireRole(user: AuthUser | null, ...allowedRoles: string[]): void {
  if (!user) throw ApiError.unauthorized();
  if (!allowedRoles.includes(user.role)) {
    throw ApiError.forbidden("Insufficient permissions");
  }
}
