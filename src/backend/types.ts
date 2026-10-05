import type { MaintenanceRequest, Profile, UserRole } from '../types'

// The signed-in user, independent of which backend is running
export type AppUser = { id: string; email: string | null }

// What a customer fills in; the backend sets id, owner, status, and timestamp
export type NewRequest = Pick<MaintenanceRequest, 'category' | 'complaint_category' | 'complaint_subcategory' | 'message'>

type Outcome = { error: string | null }

// Everything the app needs from a backend. Supabase in production, an in-browser store in demo mode.
export interface Backend {
  getUser(): Promise<AppUser | null>
  onAuthChange(callback: (user: AppUser | null) => void): () => void
  signIn(email: string, password: string): Promise<Outcome>
  // Left out by backends that don't allow registration
  signUp?(email: string, password: string): Promise<Outcome & { needsConfirmation: boolean }>
  signOut(): Promise<void>
  getRole(userId: string): Promise<UserRole | null>
  listRequests(): Promise<Outcome & { data: MaintenanceRequest[] }>
  createRequest(request: NewRequest): Promise<Outcome>
  closeRequest(id: string): Promise<Outcome>
  listProfiles(): Promise<Outcome & { data: Profile[] }>
  updateRole(id: string, role: UserRole): Promise<Outcome>
}
