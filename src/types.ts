export type RequestCategory = 'complaint' | 'maintenance'
export type RequestStatus = 'open' | 'closed'

export interface MaintenanceRequest {
  id: string
  user_id: string
  category: RequestCategory
  message: string
  status: RequestStatus
  created_at: string
}
