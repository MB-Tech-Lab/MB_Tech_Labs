/**
 * Auth Repository
 * ---------------
 * Data access for User model. Only file that touches prisma.user.
 */
import { prisma } from "../config/prisma";
import type { User, Role } from "@prisma/client";

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    name: string;
    role?: Role;
  }): Promise<User> {
    return prisma.user.create({ data });
  }

  async updateLastLogin(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async count(): Promise<number> {
    return prisma.user.count();
  }
}

export const authRepository = new AuthRepository();
