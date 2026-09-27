import { useState } from 'react'
import type { MaintenanceRequest, RequestStatus } from '../types'
import type { UserRole } from '../types'
import CustomerProfilePanel from './CustomerProfilePanel'

interface Props {
  requests: MaintenanceRequest[]
  loading: boolean
  error: string | null
  role: UserRole
  onClose: (id: string) => void
}

export default function RequestList({ requests, loading, error, role, onClose }: Props) {
  const [tab, setTab] = useState<RequestStatus>('open')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)

  const open = requests.filter((r) => r.status === 'open')
  const closed = requests.filter((r) => r.status === 'closed')
  const visible = tab === 'open' ? open : closed

  const requestList = (
    <section className="card">
      <h2>{role === 'employee' || role === 'manager' ? 'All customer requests' : 'My requests'}</h2>
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
              {(role === 'employee' || role === 'manager') && (
                <p className="request-customer">
                  Customer{' '}
                  {role === 'employee' ? (
                    <button
                      type="button"
                      className="link customer-id-link"
                      aria-label={`View demo profile and request history for customer ${r.user_id}`}
                      aria-pressed={selectedCustomerId === r.user_id}
                      onClick={() => setSelectedCustomerId(r.user_id)}
                    >
                      <code>{r.user_id}</code>
                    </button>
                  ) : <code>{r.user_id}</code>}
                </p>
              )}
              <p>{r.message}</p>
              {(role === 'employee' || role === 'manager') && r.status === 'open' && <button className="close-request" onClick={() => onClose(r.id)}>Mark closed</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )

  if (role !== 'employee') return requestList

  return (
    <div className="employee-requests-layout">
      {requestList}
      <CustomerProfilePanel
        customerId={selectedCustomerId}
        requests={requests}
        onClear={() => setSelectedCustomerId(null)}
      />
    </div>
  )
}
