import type { MaintenanceRequest } from '../types'

type Props = {
  customerId: string | null
  requests: MaintenanceRequest[]
  onClear: () => void
}

const firstNames = ['Avery', 'Jordan', 'Morgan', 'Riley', 'Casey', 'Taylor', 'Cameron', 'Quinn']
const lastNames = ['Chen', 'Patel', 'Brooks', 'Singh', 'Martin', 'Reyes', 'Wilson', 'Roy']
const districts = ['North District', 'River District', 'Lakeshore District', 'Central District']
const streets = ['Cedar Loop', 'Harbour Road', 'Maple Crescent', 'Willow Lane']
const plans = ['Home Energy & Water', 'Standard Residential', 'Time-of-Use Plus']

function hashCustomerId(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 16777619)
  }
  return hash >>> 0
}

function getDemoProfile(customerId: string) {
  const seed = hashCustomerId(customerId)
  const firstName = firstNames[seed % firstNames.length]
  const lastName = lastNames[(seed >>> 3) % lastNames.length]
  const emailSuffix = String(seed % 97).padStart(2, '0')

  return {
    id: customerId,
    name: `${firstName} ${lastName}`,
    email: `${firstName}.${lastName}${emailSuffix}@example.com`.toLowerCase(),
    phone: `416-555-01${String(seed % 100).padStart(2, '0')}`,
    address: `${10 + (seed % 890)} ${streets[(seed >>> 5) % streets.length]}, Northwind`,
    district: districts[(seed >>> 7) % districts.length],
    plan: plans[(seed >>> 9) % plans.length],
    since: 2017 + (seed % 9),
  }
}

function requestCategory(request: MaintenanceRequest) {
  if (request.category === 'maintenance') return 'Maintenance'
  return request.complaint_category
    ? `${request.complaint_category[0].toUpperCase()}${request.complaint_category.slice(1)} complaint`
    : 'Complaint'
}

export default function CustomerProfilePanel({ customerId, requests, onClear }: Props) {
  const customerRequests = customerId
    ? requests
        .filter((request) => request.user_id === customerId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    : []
  const profile = customerId ? getDemoProfile(customerId) : null

  return (
    <aside className="customer-profile-panel card" aria-label="Customer demo profile and request history">
      <div className="customer-profile-heading">
        <div>
          <p className="customer-profile-eyebrow">Employee view</p>
          <h2>{profile?.name ?? 'Customer details'}</h2>
        </div>
        {customerId && <button type="button" className="secondary customer-profile-close" onClick={onClear}>Clear</button>}
      </div>

      <p className="customer-demo-note">Sample customer details for this demo</p>

      {!profile ? (
        <p className="muted customer-profile-empty">Select a customer ID in the request list to see their profile and request history.</p>
      ) : (
        <>
          <code className="customer-profile-id">{profile.id}</code>
          <dl className="customer-profile-fields">
            <div><dt>Email</dt><dd>{profile.email}</dd></div>
            <div><dt>Phone</dt><dd>{profile.phone}</dd></div>
            <div><dt>Service address</dt><dd>{profile.address}</dd></div>
            <div><dt>Service district</dt><dd>{profile.district}</dd></div>
            <div><dt>Account plan</dt><dd>{profile.plan}</dd></div>
            <div><dt>Customer since</dt><dd>{profile.since}</dd></div>
          </dl>

          <div className="customer-history-heading">
            <h3>Request history</h3>
            <span className="badge">{customerRequests.length}</span>
          </div>
          {customerRequests.length === 0 ? (
            <p className="muted">No requests found for this customer.</p>
          ) : (
            <ul className="customer-request-history">
              {customerRequests.map((request) => (
                <li key={request.id}>
                  <div className="customer-history-meta">
                    <span className={`pill ${request.category}`}>{requestCategory(request)}</span>
                    <span className={`customer-history-status status-${request.status}`}>{request.status}</span>
                  </div>
                  <time dateTime={request.created_at}>{new Date(request.created_at).toLocaleDateString()}</time>
                  <p>{request.message}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </aside>
  )
}
