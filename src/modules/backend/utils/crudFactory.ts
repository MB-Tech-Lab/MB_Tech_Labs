/**
 * Generic CRUD Route Factory
 * --------------------------
 * Generates Next.js API route handlers for a given service.
 * Reduces boilerplate for simple CRUD endpoints.
 */
import { NextRequest } from "next/server";
import { requireAuth } from "../middlewares/auth";
import { apiResponse, apiError } from "../utils/ApiError";
import { z } from "zod";

export interface CrudService<T> {
  list: (query: Record<string, unknown>) => Promise<{ data: T[]; meta: Record<string, number> }>;
  getById: (id: string) => Promise<T>;
  create: (data: Record<string, unknown>, userId?: string) => Promise<T>;
  update: (id: string, data: Record<string, unknown>) => Promise<T>;
  delete: (id: string) => Promise<{ id: string }>;
}

export function createListHandler(service: CrudService<unknown>) {
  return async function GET(req: NextRequest) {
    try {
      requireAuth(req);
      const url = new URL(req.url);
      const query: Record<string, unknown> = {};
      url.searchParams.forEach((value, key) => {
        query[key] = key === "page" || key === "pageSize" ? parseInt(value) : value;
      });
      const result = await service.list(query);
      return apiResponse(result);
    } catch (err) {
      return apiError(err);
    }
  };
}

export function createGetByIdHandler(service: CrudService<unknown>) {
  return async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      requireAuth(req);
      const { id } = await params;
      const item = await service.getById(id);
      return apiResponse(item);
    } catch (err) {
      return apiError(err);
    }
  };
}

export function createPostHandler(service: CrudService<unknown>, schema?: z.ZodType) {
  return async function POST(req: NextRequest) {
    try {
      const user = requireAuth(req);
      const body = await req.json();
      const input = schema ? schema.parse(body) : body;
      const item = await service.create(input, user.id);
      return apiResponse(item, 201);
    } catch (err) {
      return apiError(err);
    }
  };
}

export function createPutHandler(service: CrudService<unknown>, schema?: z.ZodType) {
  return async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      requireAuth(req);
      const { id } = await params;
      const body = await req.json();
      const input = schema ? schema.parse(body) : body;
      const item = await service.update(id, input);
      return apiResponse(item);
    } catch (err) {
      return apiError(err);
    }
  };
}

export function createDeleteHandler(service: CrudService<unknown>) {
  return async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      requireAuth(req);
      const { id } = await params;
      const result = await service.delete(id);
      return apiResponse(result);
    } catch (err) {
      return apiError(err);
    }
  };
}
