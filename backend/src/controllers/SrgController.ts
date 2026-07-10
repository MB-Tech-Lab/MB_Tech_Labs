/**
 * SRG Controller
 */
import type { Request, Response } from "express";
import { srgService } from "../services/SrgService";
import { createSrgSchema, updateSrgSchema } from "../validators/srg";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export class SrgController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await srgService.list(req.query as Record<string, string>);
    res.json({ success: true, data: result.data, meta: result.meta });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const sub = await srgService.getById(req.params.id);
    res.json({ success: true, data: sub });
  });

  /**
   * Public endpoint — called by /start-project.
   * No auth required (clients submit anonymously).
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const input = createSrgSchema.parse(req.body);
    const sub = await srgService.create(input);
    res.status(201).json({ success: true, data: sub });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    if (!req.authUser) throw ApiError.unauthorized();
    const input = updateSrgSchema.parse(req.body);
    const sub = await srgService.update(req.params.id, input);
    res.json({ success: true, data: sub });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    if (!req.authUser) throw ApiError.unauthorized();
    await srgService.delete(req.params.id);
    res.json({ success: true, data: { id: req.params.id } });
  });
}

export const srgController = new SrgController();
