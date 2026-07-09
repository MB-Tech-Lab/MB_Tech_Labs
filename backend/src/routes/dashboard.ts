/**
 * Dashboard Routes
 */
import { Router } from "express";
import { dashboardController } from "../controllers/DashboardController";
import { requireAuth } from "../middlewares/auth";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);

dashboardRouter.get("/", dashboardController.getStats);
dashboardRouter.get("/activity", dashboardController.getRecentActivity);
