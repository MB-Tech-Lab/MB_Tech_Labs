/**
 * Project Routes
 */
import { Router } from "express";
import { projectController } from "../controllers/ProjectController";
import { requireAuth } from "../middlewares/auth";

export const projectRouter = Router();

projectRouter.use(requireAuth);

projectRouter.get("/", projectController.list);
projectRouter.get("/:id", projectController.getById);
projectRouter.post("/", projectController.create);
projectRouter.put("/:id", projectController.update);
projectRouter.delete("/:id", projectController.delete);
