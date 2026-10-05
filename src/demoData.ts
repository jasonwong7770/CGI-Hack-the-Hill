import type { MaintenanceRequest, Profile, UserRole } from './types'

// Every demo account shares this password. It is public on purpose: demo data never leaves the browser.
export const DEMO_PASSWORD = 'northwind-demo'

// The accounts a visitor can log in as, one per role
export const DEMO_ACCOUNTS: Record<UserRole, Profile & { name: string }> = {
  customer: { id: 'a3e1c9d2-5b7f-4c18-9e2a-6d4f8b0c1e57', email: 'johndoe@example.ca', role: 'customer', name: 'John Doe' },
  employee: { id: '0b6e4f1a-27c9-4d83-a5e0-9c1f3b7d2e64', email: 'support@northwind.ca', role: 'employee', name: 'Northwind Support' },
  manager: { id: 'e5d2a8c1-4f3b-4a96-b7e2-1c0d9f6a3b85', email: 'manager@northwind.ca', role: 'manager', name: 'Northwind Manager' },
}

// Other customers who own requests, so the staff views have a real queue
export const DEMO_CUSTOMERS: (Profile & { name: string })[] = [
  DEMO_ACCOUNTS.customer,
  { id: '6f1c2a94-3b7e-4d10-9a55-1e8c0b7d2f41', email: 'priya.patel@example.ca', role: 'customer', name: 'Priya Patel' },
  { id: 'b27d8e03-91a4-4c6f-8e2b-5d0f7a3c9e18', email: 'marcus.chen@example.ca', role: 'customer', name: 'Marcus Chen' },
  { id: 'd4a9f7c2-60e1-4b3d-b8a7-2c5e9f1d0a36', email: 'aisha.reyes@example.ca', role: 'customer', name: 'Aisha Reyes' },
]

export const DEMO_PROFILES: Profile[] = [...DEMO_CUSTOMERS, DEMO_ACCOUNTS.employee, DEMO_ACCOUNTS.manager].map(
  ({ id, email, role }) => ({ id, email, role }),
)

// Sample data for the deck's live screens, using the real complaint taxonomy (src/types.ts)
export const SAMPLE_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'sample-1',
    user_id: '6f1c2a94-3b7e-4d10-9a55-1e8c0b7d2f41',
    category: 'complaint',
    complaint_category: 'billing',
    complaint_subcategory: 'Disputed amount',
    message: 'My September bill is $80 higher than August but our usage hasn’t changed.',
    status: 'open',
    created_at: '2026-09-26T14:12:00Z',
  },
  {
    id: 'sample-2',
    user_id: 'b27d8e03-91a4-4c6f-8e2b-5d0f7a3c9e18',
    category: 'maintenance',
    complaint_category: null,
    complaint_subcategory: null,
    message: 'Low water pressure on the second floor since Monday morning.',
    status: 'open',
    created_at: '2026-09-25T09:40:00Z',
  },
  {
    id: 'sample-3',
    user_id: '6f1c2a94-3b7e-4d10-9a55-1e8c0b7d2f41',
    category: 'complaint',
    complaint_category: 'service',
    complaint_subcategory: 'Missed appointment',
    message: 'The technician never arrived for my 10 a.m. meter visit.',
    status: 'open',
    created_at: '2026-09-23T16:05:00Z',
  },
  {
    id: 'sample-4',
    user_id: 'd4a9f7c2-60e1-4b3d-b8a7-2c5e9f1d0a36',
    category: 'complaint',
    complaint_category: 'metering',
    complaint_subcategory: 'No read taken',
    message: 'Second estimated bill in a row. Nobody has read the meter since June.',
    status: 'closed',
    created_at: '2026-09-18T11:22:00Z',
  },
]

// The starting data for demo mode: the deck's samples plus John's own history
export const DEMO_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'demo-1',
    user_id: DEMO_ACCOUNTS.customer.id,
    category: 'complaint',
    complaint_category: 'billing',
    complaint_subcategory: 'Estimated read',
    message: 'My last bill was estimated even though a smart meter was installed in July.',
    status: 'open',
    created_at: '2026-09-29T10:15:00Z',
  },
  {
    id: 'demo-2',
    user_id: 'b27d8e03-91a4-4c6f-8e2b-5d0f7a3c9e18',
    category: 'complaint',
    complaint_category: 'supply',
    complaint_subcategory: 'Interruption',
    message: 'The power has cut out three evenings this week, each time for about an hour.',
    status: 'open',
    created_at: '2026-09-27T21:48:00Z',
  },
  ...SAMPLE_REQUESTS,
  {
    id: 'demo-3',
    user_id: 'd4a9f7c2-60e1-4b3d-b8a7-2c5e9f1d0a36',
    category: 'complaint',
    complaint_category: 'payment',
    complaint_subcategory: 'Plan or arrears',
    message: 'I’d like to set up a payment plan for the balance left over from last winter.',
    status: 'open',
    created_at: '2026-09-21T13:30:00Z',
  },
  {
    id: 'demo-4',
    user_id: DEMO_ACCOUNTS.customer.id,
    category: 'maintenance',
    complaint_category: null,
    complaint_subcategory: null,
    message: 'The water meter box lid on my front lawn is cracked and someone could trip on it.',
    status: 'closed',
    created_at: '2026-09-10T08:05:00Z',
  },
]
