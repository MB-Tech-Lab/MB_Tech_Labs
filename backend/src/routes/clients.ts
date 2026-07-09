/**
 * Client Routes
 * -------------
 * GET    /clients          (paginated, searchable)
 * GET    /clients/:id
 * POST   /clients
 * PUT    /clients/:id
 * DELETE /clients/:id
 */
import { Router } from "express";
import { clientController } from "../controllers/ClientController";
import { requireAuth } from "../middlewares/auth";

export const clientRouter = Router();

clientRouter.use(requireAuth); // All client routes require auth

clientRouter.get("/", clientController.list);
clientRouter.get("/:id", clientController.getById);
clientRouter.post("/", clientController.create);
clientRouter.put("/:id", clientController.update);
clientRouter.delete("/:id", clientController.delete);
