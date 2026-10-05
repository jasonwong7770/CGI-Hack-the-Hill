import type { ReactNode } from 'react'
import BillBreakdown from '../../components/BillBreakdown'
import Calendar from '../../components/Calendar'
import RequestList from '../../components/RequestList'
import StaffingDashboard from '../../components/StaffingDashboard'
import { SAMPLE_REQUESTS } from '../../demoData'
import staffingCsv from '../../../csv/northwind_contact_centre_staffing.csv?raw'

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
