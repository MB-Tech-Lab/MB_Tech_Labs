/**
 * Auth Service
 * ------------
 * Business logic: password hashing (bcrypt), JWT signing, login, refresh.
 * Framework-agnostic — uses the shared Prisma `db` client.
 */
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import type { AuthUser } from "../middlewares/auth";

const DEFAULT_ADMIN = {
  email: process.env.DEFAULT_ADMIN_EMAIL || "admin@mbtechlabs.com",
  password: process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
  name: process.env.DEFAULT_ADMIN_NAME || "Admin User",
};

export class AuthService {
  async login(email: string, password: string) {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) throw ApiError.unauthorized("Invalid email or password");
    if (!user.isActive) throw ApiError.forbidden("Account is deactivated");

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) throw ApiError.unauthorized("Invalid email or password");

    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    return {
      user: authUser,
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; email: string; role: string; name: string };
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized("Invalid refresh token");
    }

    const user = await db.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) throw ApiError.unauthorized("User not found or inactive");

    return {
      accessToken: signAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      }),
    };
  }

  async getProfile(userId: string) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound("User not found");
    const { passwordHash: _ph, ...safeUser } = user;
    void _ph;
    return safeUser;
  }

  /**
   * Create the default admin user on first server start.
   * No-op if any users already exist.
   */
  async ensureDefaultAdmin(): Promise<void> {
    const count = await db.user.count();
    if (count > 0) return;

    const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
    await db.user.create({
      data: {
        email: DEFAULT_ADMIN.email,
        passwordHash,
        name: DEFAULT_ADMIN.name,
        role: "SUPER_ADMIN",
      },
    });
    console.log(`[Auth] Created default admin: ${DEFAULT_ADMIN.email} / ${DEFAULT_ADMIN.password}`);
  }
}

export const authService = new AuthService();
