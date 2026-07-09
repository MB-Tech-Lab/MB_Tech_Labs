/**
 * Auth Controller
 * ---------------
 * Handles HTTP request/response for /auth/* endpoints.
 */
import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/AuthService";
import { loginSchema, refreshSchema } from "../validators/auth";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export class AuthController {
  login = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input.email, input.password);
    res.json({ success: true, data: result });
  });

  refresh = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const input = refreshSchema.parse(req.body);
    const result = await authService.refresh(input.refreshToken);
    res.json({ success: true, data: result });
  });

  profile = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.authUser) throw ApiError.unauthorized();
    const user = await authService.getProfile(req.authUser.id);
    res.json({ success: true, data: user });
  });

  logout = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    // Stateless JWT — client just discards tokens.
    // (For production, add a token blacklist in Redis.)
    res.json({ success: true, data: { message: "Logged out" } });
  });
}

export const authController = new AuthController();
