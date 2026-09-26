export type RequestCategory = 'complaint' | 'maintenance'
export type RequestStatus = 'open' | 'closed'
export type UserRole = 'customer' | 'employee'

export interface MaintenanceRequest {
  id: string
  user_id: string
  category: RequestCategory
  message: string
  status: RequestStatus
  created_at: string
}
