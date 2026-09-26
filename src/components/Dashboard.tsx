import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient'
import type { MaintenanceRequest } from '../types'
import RequestForm from './RequestForm'
import RequestList from './RequestList'

export default function Dashboard({ session }: { session: Session }) {
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

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  return (
    <div className="dashboard">
      <header className="topbar">
        <span className="muted">{session.user.email}</span>
        <button className="secondary" onClick={() => supabase.auth.signOut()}>
          Log out
        </button>
      </header>

      <RequestForm onSubmitted={fetchRequests} />
      <RequestList requests={requests} loading={loading} error={error} />
    </div>
  )
}
