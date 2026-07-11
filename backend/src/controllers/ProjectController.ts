/**
 * Project Controller
 */
import type { Request, Response } from "express";
import { projectService } from "../services/ProjectService";
import { createProjectSchema, updateProjectSchema } from "../validators/project";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export class ProjectController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await projectService.list(req.query as Record<string, string>);
    res.json({ success: true, data: result.data, meta: result.meta });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.getById(req.params.id);
    res.json({ success: true, data: project });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    if (!req.authUser) throw ApiError.unauthorized();
    const input = createProjectSchema.parse(req.body);
    const project = await projectService.create(input, req.authUser.id);
    res.status(201).json({ success: true, data: project });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    if (!req.authUser) throw ApiError.unauthorized();
    const input = updateProjectSchema.parse(req.body);
    const project = await projectService.update(req.params.id, input);
    res.json({ success: true, data: project });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    if (!req.authUser) throw ApiError.unauthorized();
    await projectService.delete(req.params.id);
    res.json({ success: true, data: { id: req.params.id } });
  });
}

export const projectController = new ProjectController();
