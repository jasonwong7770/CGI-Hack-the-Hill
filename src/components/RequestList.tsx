import { useState } from 'react'
import type { MaintenanceRequest, RequestStatus } from '../types'

interface Props {
  requests: MaintenanceRequest[]
  loading: boolean
  error: string | null
}

export default function RequestList({ requests, loading, error }: Props) {
  const [tab, setTab] = useState<RequestStatus>('open')

  const open = requests.filter((r) => r.status === 'open')
  const closed = requests.filter((r) => r.status === 'closed')
  const visible = tab === 'open' ? open : closed

  return (
    <section className="card">
      <h2>My requests</h2>
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
              <p>{r.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
