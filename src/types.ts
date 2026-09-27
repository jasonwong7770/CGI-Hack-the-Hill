export type RequestCategory = 'complaint' | 'maintenance'
export type RequestStatus = 'open' | 'closed'
export type UserRole = 'customer' | 'employee' | 'manager'

export type ComplaintCategory = 'billing' | 'service' | 'metering' | 'supply' | 'payment' | 'water' | 'other'

export const COMPLAINT_CATEGORIES: { value: ComplaintCategory; label: string; subcategories: string[] }[] = [
  { value: 'billing', label: 'Billing', subcategories: ['Disputed amount', 'Estimated read'] },
  { value: 'service', label: 'Service', subcategories: ['Poor communication', 'Missed appointment'] },
  { value: 'metering', label: 'Metering', subcategories: ['No read taken'] },
  { value: 'supply', label: 'Supply', subcategories: ['Interruption'] },
  { value: 'payment', label: 'Payment', subcategories: ['Plan or arrears'] },
  { value: 'water', label: 'Water', subcategories: ['Pressure or quality'] },
  { value: 'other', label: 'Other', subcategories: [] },
]

export interface MaintenanceRequest {
  id: string
  user_id: string
  category: RequestCategory
  complaint_category: ComplaintCategory | null
  complaint_subcategory: string | null
  message: string
  status: RequestStatus
  created_at: string
}

export interface Profile {
  id: string
  email: string | null
  role: UserRole
}
