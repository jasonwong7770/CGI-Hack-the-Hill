import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured =
  !!supabaseUrl?.startsWith('http') && !!supabaseAnonKey && !supabaseAnonKey.startsWith('your-')

if (!isSupabaseConfigured) {
  console.info(
    'Supabase is not configured, so the app runs in demo mode with sample accounts. To use a real backend, copy .env.example to .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
  )
}

// Fallback values keep the app from crashing before keys are added.
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'http://localhost:54321',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
)
