import { createClient } from '@supabase/supabase-js';

// Your Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL ;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Debug logging

// Validate required parameters
if (!supabaseKey) {
  throw new Error('REACT_APP_SUPABASE_ANON_KEY is required. Please check your .env file.');
}

// Create Supabase client with debug logging
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    debug: true,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export { supabase };
export default supabase;