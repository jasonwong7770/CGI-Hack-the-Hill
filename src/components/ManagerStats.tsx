import type { MaintenanceRequest } from '../types'

export default function ManagerStats({ requests }: { requests: MaintenanceRequest[] }) {
  const total = requests.length
  const open = requests.filter((r) => r.status === 'open').length
  const closed = total - open
  const maintenance = requests.filter((r) => r.category === 'maintenance').length
  const complaint = total - maintenance

  const tiles = [
    { label: 'Total requests', value: total },
    { label: 'Open', value: open },
    { label: 'Closed', value: closed },
    { label: 'Maintenance', value: maintenance },
    { label: 'Complaints', value: complaint },
  ]

  return (
    <section className="card manager-stats">
      <h2>Overview</h2>
      <div className="stat-grid">
        {tiles.map((tile) => (
          <div className="stat-tile" key={tile.label}>
            <span className="stat-value">{tile.value}</span>
            <span className="stat-label">{tile.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
