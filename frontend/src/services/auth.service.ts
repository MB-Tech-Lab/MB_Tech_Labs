import { createClient } from '../lib/supabase/client';

export const AuthService = {
  async login(email: string, password: string = 'password123') {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    // Get user profile (role)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return { 
      data: {
        id: data.user.id,
        name: profile?.full_name || email,
        email: data.user.email,
        role: profile?.role || 'intern',
      }, 
      error: null 
    };
  },

  async logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
  },
  
  async getCurrentUser() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    return {
      id: user.id,
      name: profile?.full_name || user.email,
      email: user.email,
      role: profile?.role || 'intern',
    };
  }
};
