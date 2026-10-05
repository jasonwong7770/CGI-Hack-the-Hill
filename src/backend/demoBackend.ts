import { DEMO_PASSWORD, DEMO_PROFILES, DEMO_REQUESTS } from '../demoData'
import type { MaintenanceRequest, Profile, UserRole } from '../types'
import type { AppUser, Backend } from './types'

// Demo mode keeps its data in this browser only, so visitors can't change each other's demo
const DATA_KEY = 'northwind-demo-data-v1'
const SESSION_KEY = 'northwind-demo-session-v1'

type DemoData = { profiles: Profile[]; requests: MaintenanceRequest[] }

function seed(): DemoData {
  return { profiles: structuredClone(DEMO_PROFILES), requests: structuredClone(DEMO_REQUESTS) }
}

// Storage can be blocked (private windows, previews); the demo then still works until a reload
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch {
    // fall through to the fallback
  }
  return fallback
}

function save(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // keep the in-memory copy
  }
}

let data = load<DemoData>(DATA_KEY, seed())
let userId = load<string | null>(SESSION_KEY, null)
const listeners = new Set<(user: AppUser | null) => void>()

function currentUser(): AppUser | null {
  const profile = data.profiles.find((p) => p.id === userId)
  return profile ? { id: profile.id, email: profile.email } : null
}

function currentRole(): UserRole | null {
  return data.profiles.find((p) => p.id === userId)?.role ?? null
}

function setSession(id: string | null) {
  userId = id
  save(SESSION_KEY, id)
  const user = currentUser()
  listeners.forEach((listener) => listener(user))
}

function commit() {
  save(DATA_KEY, data)
}

const isStaff = (role: UserRole | null) => role === 'employee' || role === 'manager'

// Mirrors the Row Level Security rules in supabase/schema.sql
export const demoBackend: Backend = {
  async getUser() {
    return currentUser()
  },

  onAuthChange(callback) {
    listeners.add(callback)
    return () => listeners.delete(callback)
  },

  async signIn(email, password) {
    const profile = data.profiles.find((p) => p.email?.toLowerCase() === email.trim().toLowerCase())
    if (!profile || password !== DEMO_PASSWORD) return { error: 'Invalid login credentials' }
    setSession(profile.id)
    return { error: null }
  },

  async signOut() {
    setSession(null)
  },

  async getRole(id) {
    return data.profiles.find((p) => p.id === id)?.role ?? null
  },

  async listRequests() {
    const role = currentRole()
    const visible = isStaff(role) ? data.requests : data.requests.filter((r) => r.user_id === userId)
    const sorted = [...visible].sort((a, b) => b.created_at.localeCompare(a.created_at))
    return { data: structuredClone(sorted), error: null }
  },

  async createRequest(request) {
    if (!userId) return { error: 'You need to be logged in to submit a request.' }
    data.requests.push({ ...request, id: crypto.randomUUID(), user_id: userId, status: 'open', created_at: new Date().toISOString() })
    commit()
    return { error: null }
  },

  async closeRequest(id) {
    if (!isStaff(currentRole())) return { error: 'Only staff can close requests.' }
    const request = data.requests.find((r) => r.id === id)
    if (request) request.status = 'closed'
    commit()
    return { error: null }
  },

  async listProfiles() {
    const all = currentRole() === 'manager' ? data.profiles : data.profiles.filter((p) => p.id === userId)
    const sorted = [...all].sort((a, b) => (a.email ?? '').localeCompare(b.email ?? ''))
    return { data: structuredClone(sorted), error: null }
  },

  async updateRole(id, role) {
    if (currentRole() !== 'manager' || id === userId) return { error: 'Only a manager can change another account’s role.' }
    const profile = data.profiles.find((p) => p.id === id)
    if (profile) profile.role = role
    commit()
    return { error: null }
  },
}

// Puts every request and role back to the starting sample data, keeping the visitor logged in
export function resetDemo() {
  data = seed()
  commit()
}
