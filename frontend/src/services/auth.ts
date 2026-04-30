import { User, Role } from '@/types';
import { MOCK_USERS } from './mockData';

const AUTH_TOKEN_KEY = 'mb_auth_token';
const USER_KEY = 'mb_current_user';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Mock authentication service
// In production, this would call a real backend API
export class AuthService {
  // Simulate login
  static async login(credentials: AuthCredentials): Promise<LoginResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user by email
    const user = Object.values(MOCK_USERS).find(u => u.email === credentials.email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // In production, verify password hash
    // For demo, any password works if email matches
    if (!credentials.password) {
      throw new Error('Password is required');
    }

    // Generate mock JWT token
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email, timestamp: Date.now() }));

    return {
      user,
      token,
    };
  }

  // Logout
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  // Store auth data
  static storeAuth(token: string, user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  // Get stored auth token
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    }
    return null;
  }

  // Get stored user
  static getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr) as User;
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getToken() !== null && this.getUser() !== null;
  }

  // Get user role
  static getUserRole(): Role | null {
    const user = this.getUser();
    return user?.role ?? null;
  }
}

// Pre-defined demo accounts for easy testing
export const DEMO_ACCOUNTS = [
  { email: 'admin@mbtechlabs.com', password: 'demo123', role: 'Admin' },
  { email: 'exec@mbtechlabs.com', password: 'demo123', role: 'Executive Officer' },
  { email: 'manager@mbtechlabs.com', password: 'demo123', role: 'Project Manager' },
  { email: 'lead@mbtechlabs.com', password: 'demo123', role: 'Team Lead' },
  { email: 'senior@mbtechlabs.com', password: 'demo123', role: 'Senior Developer' },
  { email: 'junior@mbtechlabs.com', password: 'demo123', role: 'Junior Developer' },
  { email: 'intern@mbtechlabs.com', password: 'demo123', role: 'Intern' },
  { email: 'hr@mbtechlabs.com', password: 'demo123', role: 'HR Manager' },
  { email: 'marketing@mbtechlabs.com', password: 'demo123', role: 'Marketing Manager' },
];
