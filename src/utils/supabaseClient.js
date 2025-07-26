import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error, operation = 'operation') => {
  console.log(`Supabase ${operation} error:`, error);
  
  if (error?.message?.includes('Failed to fetch') || 
      error?.message?.includes('AuthRetryableFetchError')) {
    return `Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.`;
  }
  
  return error?.message || `An error occurred during ${operation}`;
};

export default supabase;