import { supabase } from './supabase';
import type { AuthResponse, LoginFormData, RegisterFormData, User } from './types';

// Authentication functions
export const signUp = async (data: RegisterFormData): Promise<AuthResponse> => {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: data.role || 'client',
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { user: authData.user as any, session: authData.session };
  } catch (error) {
    return { error: 'An unexpected error occurred during registration' };
  }
};

export const signIn = async (data: LoginFormData): Promise<AuthResponse> => {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return { error: error.message };
    }

    return { user: authData.user as any, session: authData.session };
  } catch (error) {
    return { error: 'An unexpected error occurred during login' };
  }
};

export const signOut = async (): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return {};
  } catch (error) {
    return { error: 'An unexpected error occurred during logout' };
  }
};

export const getCurrentUser = async (): Promise<{ user?: User; error?: string }> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      return { error: error.message };
    }

    if (!user) {
      return { user: undefined };
    }

    // Get user profile from our users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return { error: profileError.message };
    }

    return { user: profile };
  } catch (error) {
    return { error: 'An unexpected error occurred while fetching user data' };
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error) {
    return { error: 'An unexpected error occurred while updating profile' };
  }
};

// Role-based access control
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

export const isClient = (user: User | null): boolean => {
  return user?.role === 'client';
};

export const canAccessAdminRoutes = (user: User | null): boolean => {
  return isAdmin(user);
};

export const canAccessClientRoutes = (user: User | null): boolean => {
  return isClient(user) || isAdmin(user);
};

// Password reset
export const resetPassword = async (email: string): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error) {
    return { error: 'An unexpected error occurred while sending reset email' };
  }
};

// Update password
export const updatePassword = async (password: string): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error) {
    return { error: 'An unexpected error occurred while updating password' };
  }
};

// Session management
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      return { error: error.message };
    }

    return { session };
  } catch (error) {
    return { error: 'An unexpected error occurred while getting session' };
  }
};

// Listen to auth changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      // Get user profile when auth state changes
      const { user } = await getCurrentUser();
      callback(user || null);
    } else {
      callback(null);
    }
  });
};
