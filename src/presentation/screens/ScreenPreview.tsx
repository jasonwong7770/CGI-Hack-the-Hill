import type { ReactNode } from 'react'
import BillBreakdown from '../../components/BillBreakdown'
import Calendar from '../../components/Calendar'
import RequestList from '../../components/RequestList'
import StaffingDashboard from '../../components/StaffingDashboard'
import type { MaintenanceRequest } from '../../types'
import staffingCsv from '../../../csv/northwind_contact_centre_staffing.csv?raw'

// Sample data for the deck's live screens, using the real complaint taxonomy (src/types.ts)
const SAMPLE_REQUESTS: MaintenanceRequest[] = [
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

const SCREENS: Record<string, () => ReactNode> = {
  'my-requests': () => (
    <RequestList requests={SAMPLE_REQUESTS} loading={false} error={null} role="customer" onClose={() => {}} />
  ),
  queue: () => <RequestList requests={SAMPLE_REQUESTS} loading={false} error={null} role="employee" onClose={() => {}} />,
  bill: () => <BillBreakdown />,
  calendar: () => <Calendar />,
  staffing: () => (
    <StaffingDashboard initialData={{ fileName: 'northwind_contact_centre_staffing.csv', csv: staffingCsv }} />
  ),
}

// Renders one real app component on its own at /presentation/screen/<name>, for the deck's iframes
export default function ScreenPreview({ name }: { name: string }) {
  const screen = SCREENS[name]
  return <div className="app">{screen ? screen() : <p className="muted center">Unknown screen “{name}”.</p>}</div>
}
