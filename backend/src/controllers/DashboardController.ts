/**
 * Dashboard Controller
 */
import type { Request, Response } from "express";
import { dashboardService } from "../services/DashboardService";
import { asyncHandler } from "../utils/asyncHandler";

export class DashboardController {
  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await dashboardService.getStats();
    res.json({ success: true, data: stats });
  });

  getRecentActivity = asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const activities = await dashboardService.getRecentActivity(limit);
    res.json({ success: true, data: activities });
  });
}

export const dashboardController = new DashboardController();
