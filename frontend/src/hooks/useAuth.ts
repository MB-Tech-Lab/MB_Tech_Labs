import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../stores/useAuthStore';
import { AuthService } from '../services/auth.service';
import { Role } from '../types/user';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout, token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogin = async (email: string, password?: string) => {
    try {
      const response = await AuthService.login(email, password);
      if (response.error) throw new Error(response.error);
      if (response.data) {
        // We no longer receive a token from Supabase here, so pass a dummy string
        login(response.data as any, 'supabase_token');
        
        // Middleware handles the role-based redirection, so just push to dashboard and let it route
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    logout();
    router.push('/login');
  };

  // Enforce protection (Optional client-side redirect if middleware misses or to handle UI mounting)
  useEffect(() => {
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router]);

  return {
    user,
    isAuthenticated,
    token,
    login: handleLogin,
    logout: handleLogout,
  };
};
