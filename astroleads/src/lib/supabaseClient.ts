
import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
// These are set in Vercel dashboard and .env.local for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials not found in environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
