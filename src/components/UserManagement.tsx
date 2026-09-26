import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import type { Profile, UserRole } from '../types'

const ROLES: UserRole[] = ['customer', 'employee', 'manager']

export default function UserManagement({ currentUserId }: { currentUserId: string }) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role')
      .order('email')

    if (error) setError(error.message)
    else {
      setError(null)
      setProfiles((data as Profile[]).filter((p) => p.id !== currentUserId))
    }
    setLoading(false)
  }, [currentUserId])

  async function updateRole(id: string, role: UserRole) {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
    if (error) setError(error.message)
    else fetchProfiles()
  }

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  return (
    <section className="card user-management">
      <h2>Manage accounts</h2>
      {error ? (
        <p className="error">{error}</p>
      ) : loading && profiles.length === 0 ? (
        <p className="muted">Loading…</p>
      ) : profiles.length === 0 ? (
        <p className="muted">No other accounts yet.</p>
      ) : (
        <ul className="profile-list">
          {profiles.map((p) => (
            <li className="profile-row" key={p.id}>
              <span className="profile-email">{p.email ?? p.id}</span>
              <span className={`role-badge ${p.role}`}>{p.role}</span>
              <select value={p.role} onChange={(e) => updateRole(p.id, e.target.value as UserRole)}>
                {ROLES.map((role) => (
                  <option value={role} key={role}>{role}</option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
