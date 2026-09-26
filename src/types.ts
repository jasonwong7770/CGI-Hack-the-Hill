export type RequestCategory = 'complaint' | 'maintenance'
export type RequestStatus = 'open' | 'closed'
export type UserRole = 'customer' | 'employee' | 'manager'

export interface MaintenanceRequest {
  id: string
  user_id: string
  category: RequestCategory
  message: string
  status: RequestStatus
  created_at: string
}

export interface Profile {
  id: string
  email: string | null
  role: UserRole
}
