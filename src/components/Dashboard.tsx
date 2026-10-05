import { useCallback, useEffect, useState } from 'react'
import { backend, isDemoMode, resetDemo, type AppUser } from '../backend'
import type { MaintenanceRequest } from '../types'
import RequestForm from './RequestForm'
import RequestList from './RequestList'
import BillBreakdown from "./BillBreakdown";
import Calendar from './Calendar'
import ManagerStats from './ManagerStats'
import UserManagement from './UserManagement'
import StaffingDashboard from './StaffingDashboard'
import staffingCsv from '../../csv/northwind_contact_centre_staffing.csv?raw'
import type { UserRole } from '../types'

type CustomerTab = 'new-request' | 'bill' | 'calendar' | 'my-requests'

const CUSTOMER_TABS: { value: CustomerTab; label: string }[] = [
  { value: 'new-request', label: 'New request' },
  { value: 'bill', label: 'Bill breakdown' },
  { value: 'calendar', label: 'Appointments' },
  { value: 'my-requests', label: 'My requests' },
]

const CUSTOMER_TAB_TITLES: Record<CustomerTab, string> = {
  'new-request': 'New Request',
  bill: 'Bill Breakdown',
  calendar: 'Appointments',
  'my-requests': 'My Requests',
}

export default function Dashboard({ user, role, onSignOut }: { user: AppUser; role: UserRole; onSignOut: () => void }) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [customerTab, setCustomerTab] = useState<CustomerTab>('new-request')

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    const { data, error } = await backend.listRequests()

    if (error) setError(error)
    else {
      setError(null)
      setRequests(data)
    }
    setLoading(false)
  }, [])

  async function closeRequest(requestId: string) {
    const { error } = await backend.closeRequest(requestId)
    if (error) setError(error)
    else fetchRequests()
  }

  // Reloading picks up the fresh sample data in every panel, including the manager's account list
  function resetDemoData() {
    resetDemo()
    window.location.reload()
  }

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  useEffect(() => {
    const roleLabel = role === 'manager' ? 'Manager Dashboard' : role === 'employee' ? 'Employee Workspace' : CUSTOMER_TAB_TITLES[customerTab]
    document.title = `${roleLabel} – Northwind Utilities`
  }, [role, customerTab])

  return (
    <div className="dashboard">
      <header className="topbar">
        <div><span className="brand small">Northwind <span>Utilities</span></span><span className="role-label">{role === 'manager' ? 'Manager dashboard' : role === 'employee' ? 'Employee workspace' : 'Customer account'}</span></div>
        <div className="account-actions"><span className="muted">{user.email}</span>
        {isDemoMode && (
          <button className="secondary" onClick={resetDemoData} title="Put every request and role back to the starting sample data">
            Reset demo
          </button>
        )}
        <button className="secondary" onClick={async () => { await backend.signOut(); onSignOut() }}>
          Log out
        </button>
        </div>
      </header>

      {/* Demo visitors don't have the CSV to upload, so demo mode starts with the challenge data loaded */}
      {role === 'manager' && (
        <StaffingDashboard initialData={isDemoMode ? { fileName: 'northwind_contact_centre_staffing.csv', csv: staffingCsv } : undefined} />
      )}
      {role === 'manager' && <ManagerStats requests={requests} />}
      {role === 'manager' && <UserManagement currentUserId={user.id} />}
      {role === 'employee' && <Calendar employeeView requests={requests} />}

      {role === 'customer' && (
        <>
          <div className="tabs" role="tablist">
            {CUSTOMER_TABS.map((t) => (
              <button
                key={t.value}
                role="tab"
                aria-selected={customerTab === t.value}
                className={customerTab === t.value ? 'tab active' : 'tab'}
                onClick={() => setCustomerTab(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {customerTab === 'new-request' && <RequestForm onSubmitted={fetchRequests} />}
          {customerTab === 'bill' && <BillBreakdown />}
          {customerTab === 'calendar' && <Calendar />}
          {customerTab === 'my-requests' && (
            <RequestList requests={requests} loading={loading} error={error} role={role} onClose={closeRequest} />
          )}
        </>
      )}

      {role !== 'customer' && (
        <RequestList requests={requests} loading={loading} error={error} role={role} onClose={closeRequest} />
      )}
    </div>
  )
}
