import type { User } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient'
import type { MaintenanceRequest, Profile } from '../types'
import type { AppUser, Backend } from './types'

function toAppUser(user: User | null | undefined): AppUser | null {
  return user ? { id: user.id, email: user.email ?? null } : null
}

// Row Level Security in supabase/schema.sql decides what each role can read and change
export const supabaseBackend: Backend = {
  async getUser() {
    const { data } = await supabase.auth.getSession()
    return toAppUser(data.session?.user)
  },

  onAuthChange(callback) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(toAppUser(session?.user)))
    return () => data.subscription.unsubscribe()
  },

  async signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  },

  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    return { error: error?.message ?? null, needsConfirmation: !error && !data.session }
  },

  async signOut() {
    await supabase.auth.signOut()
  },

  async getRole(userId) {
    const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).single()
    if (error) {
      console.error('Failed to load profile role:', error)
      return null
    }
    return data?.role === 'manager' ? 'manager' : data?.role === 'employee' ? 'employee' : 'customer'
  },

  async listRequests() {
    const { data, error } = await supabase.from('requests').select('*').order('created_at', { ascending: false })
    return { data: (data as MaintenanceRequest[] | null) ?? [], error: error?.message ?? null }
  },

  async createRequest(request) {
    // user_id and status are filled in by database defaults.
    const { error } = await supabase.from('requests').insert(request)
    return { error: error?.message ?? null }
  },

  async closeRequest(id) {
    const { error } = await supabase.from('requests').update({ status: 'closed' }).eq('id', id)
    return { error: error?.message ?? null }
  },

  async listProfiles() {
    const { data, error } = await supabase.from('profiles').select('id, email, role').order('email')
    return { data: (data as Profile[] | null) ?? [], error: error?.message ?? null }
  },

  async updateRole(id, role) {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
    return { error: error?.message ?? null }
  },
}
