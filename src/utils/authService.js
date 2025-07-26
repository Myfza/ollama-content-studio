import { supabase, handleSupabaseError } from './supabaseClient';

const authService = {
  // Sign up new user
  signUp: async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || userData.full_name || '',
            role: userData.role || 'member'
          }
        }
      });

      if (error) {
        return { success: false, error: handleSupabaseError(error, 'signup') };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'signup') };
    }
  },

  // Sign in user
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: handleSupabaseError(error, 'signin') };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'signin') };
    }
  },

  // Sign out user
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: handleSupabaseError(error, 'signout') };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'signout') };
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return { success: false, error: handleSupabaseError(error, 'get session') };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'get session') };
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { success: false, error: handleSupabaseError(error, 'get user profile') };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'get user profile') };
    }
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: handleSupabaseError(error, 'update profile') };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'update profile') };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return { success: false, error: handleSupabaseError(error, 'password reset') };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'password reset') };
    }
  },

  // Auth state change listener
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Sign in with OAuth
  signInWithOAuth: async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        return { success: false, error: handleSupabaseError(error, 'OAuth signin') };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'OAuth signin') };
    }
  }
};

export default authService;