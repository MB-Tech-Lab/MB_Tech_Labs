/**
 * Auth Middleware
 * ---------------
 * - requireAuth: validates JWT, attaches user to req
 * - requireRole: role-based access control
 */
import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import type { JwtPayload, AuthUser } from "../types";
import type { Role } from "@prisma/client";

// Extend Express Request to carry auth user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Missing or invalid Authorization header");
    }
    const token = header.slice(7);
    const payload = verifyAccessToken(token) as JwtPayload;

    req.authUser = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role as Role,
    };
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}

/**
 * Role-based access control. Pass allowed roles.
 * Example: requireRole("SUPER_ADMIN", "ADMIN")
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.authUser) {
      return next(ApiError.unauthorized());
    }
    if (!allowedRoles.includes(req.authUser.role)) {
      return next(ApiError.forbidden("Insufficient permissions"));
    }
    next();
  };
}
