/**
 * Client Controller
 */
import type { Request, Response, NextFunction } from "express";
import { clientService } from "../services/ClientService";
import { createClientSchema, updateClientSchema } from "../validators/client";
import { asyncHandler } from "../utils/asyncHandler";

export class ClientController {
  list = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const result = await clientService.list(req.query as Record<string, string>);
    res.json({ success: true, data: result.data, meta: result.meta });
  });

  getById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const client = await clientService.getById(req.params.id);
    res.json({ success: true, data: client });
  });

  create = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const input = createClientSchema.parse(req.body);
    const client = await clientService.create(input, req.authUser?.id);
    res.status(201).json({ success: true, data: client });
  });

  update = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const input = updateClientSchema.parse(req.body);
    const client = await clientService.update(req.params.id, input);
    res.json({ success: true, data: client });
  });

  delete = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    await clientService.delete(req.params.id);
    res.json({ success: true, data: { id: req.params.id } });
  });
}

export const clientController = new ClientController();
