import { isSupabaseConfigured } from '../supabaseClient'
import { demoBackend } from './demoBackend'
import { supabaseBackend } from './supabaseBackend'

export type { AppUser, Backend, NewRequest } from './types'
export { resetDemo } from './demoBackend'

// Without Supabase keys the app runs as a self-contained demo with sample accounts
export const isDemoMode = !isSupabaseConfigured

export const backend = isDemoMode ? demoBackend : supabaseBackend
