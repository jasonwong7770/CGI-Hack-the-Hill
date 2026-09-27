import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient'
import type { MaintenanceRequest } from '../types'
import RequestForm from './RequestForm'
import RequestList from './RequestList'
import BillBreakdown from "./BillBreakdown";
import Calendar from './Calendar'
import ManagerStats from './ManagerStats'
import UserManagement from './UserManagement'
import StaffingDashboard from './StaffingDashboard'
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

export default function Dashboard({ session, role, onSignOut }: { session: Session; role: UserRole; onSignOut: () => void }) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [customerTab, setCustomerTab] = useState<CustomerTab>('new-request')

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else {
      setError(null)
      setRequests(data as MaintenanceRequest[])
    }
    setLoading(false)
  }, [])

  async function closeRequest(requestId: string) {
    const { error } = await supabase.from('requests').update({ status: 'closed' }).eq('id', requestId)
    if (error) setError(error.message)
    else fetchRequests()
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
        <div className="account-actions"><span className="muted">{session.user.email}</span>
        <button className="secondary" onClick={async () => { await supabase.auth.signOut(); onSignOut() }}>
          Log out
        </button>
        </div>
      </header>

      {role === 'manager' && <StaffingDashboard />}
      {role === 'manager' && <ManagerStats requests={requests} />}
      {role === 'manager' && <UserManagement currentUserId={session.user.id} />}
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
