/**
 * SRG Routes
 * ----------
 * GET    /srg              (protected) — admin list
 * GET    /srg/:id          (protected) — admin detail
 * POST   /srg              (public)    — client submission from /start-project
 * PUT    /srg/:id          (protected) — admin update
 * DELETE /srg/:id          (protected) — admin delete
 */
import { Router } from "express";
import { srgController } from "../controllers/SrgController";
import { requireAuth } from "../middlewares/auth";

export const srgRouter = Router();

// Public: clients submit from /start-project (no auth)
srgRouter.post("/", srgController.create);

// Protected: admin only
srgRouter.get("/", requireAuth, srgController.list);
srgRouter.get("/:id", requireAuth, srgController.getById);
srgRouter.put("/:id", requireAuth, srgController.update);
srgRouter.delete("/:id", requireAuth, srgController.delete);
