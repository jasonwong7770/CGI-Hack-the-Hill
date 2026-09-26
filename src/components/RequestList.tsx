import { useState } from 'react'
import type { MaintenanceRequest, RequestStatus } from '../types'
import type { UserRole } from '../types'

interface Props {
  requests: MaintenanceRequest[]
  loading: boolean
  error: string | null
  role: UserRole
  onClose: (id: string) => void
}

export default function RequestList({ requests, loading, error, role, onClose }: Props) {
  const [tab, setTab] = useState<RequestStatus>('open')

  const open = requests.filter((r) => r.status === 'open')
  const closed = requests.filter((r) => r.status === 'closed')
  const visible = tab === 'open' ? open : closed

  return (
    <section className="card">
      <h2>{role === 'employee' ? 'All customer requests' : 'My requests'}</h2>
      <div className="tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'open'}
          className={tab === 'open' ? 'tab active' : 'tab'}
          onClick={() => setTab('open')}
        >
          Open <span className="badge">{open.length}</span>
        </button>
        <button
          role="tab"
          aria-selected={tab === 'closed'}
          className={tab === 'closed' ? 'tab active' : 'tab'}
          onClick={() => setTab('closed')}
        >
          Closed <span className="badge">{closed.length}</span>
        </button>
      </div>

      {error ? (
        <p className="error">{error}</p>
      ) : loading && requests.length === 0 ? (
        <p className="muted">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="muted">No {tab} requests.</p>
      ) : (
        <ul className="requests">
          {visible.map((r) => (
            <li key={r.id}>
              <div className="request-meta">
                <span className={`pill ${r.category}`}>{r.category}</span>
                <span className="muted">{new Date(r.created_at).toLocaleString()}</span>
              </div>
              {role === 'employee' && <p className="request-customer">Customer <code>{r.user_id}</code></p>}
              <p>{r.message}</p>
              {role === 'employee' && r.status === 'open' && <button className="close-request" onClick={() => onClose(r.id)}>Mark closed</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
