/**
 * Auth API Service
 * ----------------
 * All authentication-related API calls.
 */
import { api, tokenStorage } from "./client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResult> {
    const result = await api.post<LoginResult>("/api/auth/login", { email, password });
    tokenStorage.set(result.accessToken, result.refreshToken);
    return result;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/api/auth/logout");
    } finally {
      tokenStorage.clear();
    }
  },

  async getProfile(): Promise<AuthUser & Record<string, unknown>> {
    return api.get("/api/auth/profile");
  },

  async refresh(): Promise<{ accessToken: string }> {
    return api.post("/api/auth/refresh", {
      refreshToken: tokenStorage.getRefresh(),
    });
  },

  isAuthenticated(): boolean {
    return !!tokenStorage.get();
  },
};
