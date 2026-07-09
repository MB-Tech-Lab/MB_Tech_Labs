/**
 * App Configuration
 * -----------------
 * All env vars loaded here. Never access process.env directly
 * outside this file.
 */
import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  jwt: {
    secret: process.env.JWT_SECRET || "dev-secret-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-change-me",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
  defaultAdmin: {
    email: process.env.DEFAULT_ADMIN_EMAIL || "admin@mbtechlabs.com",
    password: process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
    name: process.env.DEFAULT_ADMIN_NAME || "Admin User",
  },
  uploadDir: process.env.UPLOAD_DIR || "./uploads",
} as const;
