/**
 * Auth Routes
 * -----------
 * POST /auth/login
 * POST /auth/refresh
 * GET  /auth/profile  (protected)
 * POST /auth/logout   (protected)
 */
import { Router } from "express";
import { authController } from "../controllers/AuthController";
import { requireAuth } from "../middlewares/auth";

export const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.get("/profile", requireAuth, authController.profile);
authRouter.post("/logout", requireAuth, authController.logout);
