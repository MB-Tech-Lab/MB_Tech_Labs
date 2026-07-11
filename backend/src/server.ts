/**
 * MB Tech Labs Backend — Server Entry
 * -----------------------------------
 * Express + TypeScript + Prisma.
 * Runs on port 4000 (configurable via PORT env).
 */
import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { config } from "./config";
import { authService } from "./services/AuthService";
import { errorMiddleware } from "./middlewares/error";
import { authRouter } from "./routes/auth";
import { clientRouter } from "./routes/clients";
import { projectRouter } from "./routes/projects";
import { srgRouter } from "./routes/srg";
import { dashboardRouter } from "./routes/dashboard";

const app = express();

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ─── Logging (Morgan) ────────────────────────────────────────
const logsDir = path.resolve(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
const accessLogStream = fs.createWriteStream(path.join(logsDir, "access.log"), { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// ─── Static files (uploads) ──────────────────────────────────
const uploadsDir = path.resolve(process.cwd(), config.uploadDir);
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// ─── Health check ────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

// ─── Routes ──────────────────────────────────────────────────
app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/clients", clientRouter);
app.use("/projects", projectRouter);
app.use("/srg", srgRouter);

// TODO (Phase 3): proposals, quotations, invoices, team, meetings, notifications, analytics

// ─── 404 ─────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Endpoint not found" },
  });
});

// ─── Error handler (must be last) ────────────────────────────
app.use(errorMiddleware);

// ─── Start ───────────────────────────────────────────────────
async function start() {
  // Create default admin on first run
  await authService.ensureDefaultAdmin();

  app.listen(config.port, () => {
    console.log(`\n┌─────────────────────────────────────────────┐`);
    console.log(`│  MB Tech Labs Backend                       │`);
    console.log(`│  Listening on http://localhost:${config.port}        │`);
    console.log(`│  Environment: ${config.nodeEnv.padEnd(28)}│`);
    console.log(`│  Database: ${"SQLite (swap to PostgreSQL in prod)".padEnd(30)}│`);
    console.log(`└─────────────────────────────────────────────┘\n`);
    console.log(`Default admin: ${config.defaultAdmin.email} / ${config.defaultAdmin.password}\n`);
  });
}

start().catch((err) => {
  console.error("[FATAL] Failed to start server:", err);
  process.exit(1);
});
