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
    // Get the site URL from environment or fallback to current origin
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (typeof window !== 'undefined' ? window.location.origin : 'https://uniqubit.ca');
    
    console.log('Reset password request:', { 
      email, 
      siteUrl, 
      redirectTo: `${siteUrl}/reset-password`,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    });
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    });

    if (error) {
      console.error('Supabase reset password error:', {
        message: error.message,
        status: error.status,
        code: error.code,
        details: error
      });
      
      // More specific error messages based on Supabase error types
      if (error.message.includes('rate') || error.message.includes('limit') || error.message.includes('too many')) {
        return { error: 'Too many reset attempts. Please wait a few minutes before trying again.' };
      } else if (error.message.includes('Invalid') || error.message.includes('not allowed')) {
        return { error: 'Configuration error. Please contact support if this persists.' };
      } else if (error.message.includes('User not found') || error.message.includes('not found')) {
        return { error: 'If this email is registered, you will receive a reset link shortly.' };
      } else if (error.status === 429) {
        return { error: 'Rate limit exceeded. Please wait before trying again.' };
      } else if (error.status === 400) {
        return { error: 'Invalid request. Please check your email address.' };
      } else if (error.status === 422) {
        return { error: 'Invalid email format or configuration issue.' };
      }
      
      return { error: `Password reset failed: ${error.message}` };
    }

    console.log('Reset password email sent successfully:', data);
    return {};
  } catch (error) {
    console.error('Unexpected error during password reset:', error);
    return { error: `Error sending recovery email: ${error instanceof Error ? error.message : 'Unknown error'}` };
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
