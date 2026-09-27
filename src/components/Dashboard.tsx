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

export default function Dashboard({ session, role, onSignOut }: { session: Session; role: UserRole; onSignOut: () => void }) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      {role === 'customer' && <RequestForm onSubmitted={fetchRequests} />}
      {role === 'customer' && <BillBreakdown />}
      {role === 'customer' && <Calendar />}
      <RequestList requests={requests} loading={loading} error={error} role={role} onClose={closeRequest} />
    </div>
  )
}
