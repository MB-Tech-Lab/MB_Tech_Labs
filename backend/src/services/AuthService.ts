/**
 * Auth Service
 * ------------
 * Business logic: password hashing, JWT signing, login, refresh.
 */
import bcrypt from "bcryptjs";
import { authRepository } from "../repositories/AuthRepository";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import { config } from "../config";
import type { AuthUser } from "../types";
import type { Role } from "@prisma/client";

export class AuthService {
  async login(email: string, password: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }
    if (!user.isActive) {
      throw ApiError.forbidden("Account is deactivated");
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    await authRepository.updateLastLogin(user.id);

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
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
    let payload: { sub: string; email: string; role: Role; name: string };
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized("Invalid refresh token");
    }

    const user = await authRepository.findById(payload.sub);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized("User not found or inactive");
    }

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
    const user = await authRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found");
    const { passwordHash: _ph, ...safeUser } = user;
    void _ph;
    return safeUser;
  }

  /**
   * Create the default admin user on first server start.
   * No-op if any users already exist.
   */
  async ensureDefaultAdmin() {
    const count = await authRepository.count();
    if (count > 0) return;

    const passwordHash = await bcrypt.hash(config.defaultAdmin.password, 10);
    await authRepository.create({
      email: config.defaultAdmin.email,
      passwordHash,
      name: config.defaultAdmin.name,
      role: "SUPER_ADMIN",
    });
    console.log(
      `[Auth] Created default admin: ${config.defaultAdmin.email} / ${config.defaultAdmin.password}`
    );
  }
}

export const authService = new AuthService();
