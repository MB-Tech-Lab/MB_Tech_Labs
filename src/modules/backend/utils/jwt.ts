/**
 * JWT Utilities (Next.js API route version)
 * ------------------------------------------
 * Uses the same jsonwebtoken library as the Express backend.
 * When migrating to a separate Express backend, this file moves
 * to backend/src/utils/jwt.ts unchanged.
 */
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mbtl-dev-jwt-secret-change-in-production-2024";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "mbtl-dev-refresh-secret-change-in-production-2024";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  name: string;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
}

export const jwtConfig = {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRES_IN,
  refreshSecret: JWT_REFRESH_SECRET,
  refreshExpiresIn: JWT_REFRESH_EXPIRES_IN,
};
