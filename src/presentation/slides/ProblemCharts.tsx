// Charts for the Problem slide. All figures come from the CGI challenge data:
// northwind_monthly_kpis.csv (days to close) and northwind_complaints.csv (25,416 complaints).
// Emphasis form throughout: the mark the story is about is gold, context is gray.

const W = 355 // inner width of a grid-3 card on the 1600px stage

// Screen-reader twin of each chart
function ChartTable({ caption, rows }: { caption: string; rows: [string, string][] }) {
  return (
    <table className="deck-sr-only">
      <caption>{caption}</caption>
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <th scope="row">{label}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ─── 4×: average days to close, Oct 2024 → Sep 2026 ─────────────────────────

const MONTHS = [
  'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025',
  'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026',
  'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026',
]
const DAYS_TO_CLOSE = [
  9.1, 16.5, 18.4, 19.5, 20.1, 21.4, 22.0, 23.2, 23.1, 24.9, 26.6, 28.6, 27.6, 29.8, 29.6, 31.0, 33.6, 32.8, 33.3,
  34.6, 35.9, 35.7, 37.4, 38.2,
]

export function DaysToCloseChart() {
  const H = 170
  const left = 28
  const right = 10
  const top = 30
  const bottom = 26
  const plotW = W - left - right
  const plotH = H - top - bottom
  const max = 40
  const x = (i: number) => left + (i / (DAYS_TO_CLOSE.length - 1)) * plotW
  const y = (v: number) => top + (1 - v / max) * plotH
  const points = DAYS_TO_CLOSE.map((v, i) => `${x(i)},${y(v)}`)
  const line = `M${points.join('L')}`
  const area = `${line}L${x(DAYS_TO_CLOSE.length - 1)},${y(0)}L${x(0)},${y(0)}Z`
  const last = DAYS_TO_CLOSE.length - 1
  const step = plotW / last

  return (
    <figure className="problem-chart">
      <figcaption className="chart-label">Average days to close a complaint</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {[0, 20, 40].map((tick) => (
          <g key={tick}>
            <line className="chart-grid" x1={left} x2={W - right} y1={y(tick)} y2={y(tick)} />
            <text className="chart-tick" x={left - 8} y={y(tick) + 5} textAnchor="end">
              {tick}
            </text>
          </g>
        ))}
        <path className="chart-area chart-draw-fade" d={area} />
        <path className="chart-line chart-draw" d={line} pathLength={1} />
        <circle className="chart-dot is-muted" cx={x(0)} cy={y(DAYS_TO_CLOSE[0])} r={6} />
        <circle className="chart-dot" cx={x(last)} cy={y(DAYS_TO_CLOSE[last])} r={6} />
        {/* Below the start dot: the line climbs steeply right after it */}
        <text className="chart-value" x={x(0) + 12} y={y(DAYS_TO_CLOSE[0]) + 20}>
          9 days
        </text>
        <text className="chart-value" x={x(last)} y={y(DAYS_TO_CLOSE[last]) - 14} textAnchor="end">
          38 days
        </text>
        <text className="chart-tick" x={left} y={H - 4}>
          {MONTHS[0]}
        </text>
        <text className="chart-tick" x={W - right} y={H - 4} textAnchor="end">
          {MONTHS[last]}
        </text>
        {/* One hover column per month, wider than the line so it's easy to hit */}
        {DAYS_TO_CLOSE.map((v, i) => (
          <rect key={MONTHS[i]} className="chart-hit" x={x(i) - step / 2} y={top} width={step} height={plotH}>
            <title>{`${MONTHS[i]}: ${v} days`}</title>
          </rect>
        ))}
      </svg>
      <ChartTable
        caption="Average days to close a complaint, by month"
        rows={DAYS_TO_CLOSE.map((v, i) => [MONTHS[i], `${v} days`])}
      />
    </figure>
  )
}

// ─── 35%: transferred between systems, and how often those reopen ──────────

const TRANSFERRED_SHARE = 34.9 // % of all complaints
const REOPENED = [
  { label: 'Transferred', value: 29, emphasis: true },
  { label: 'One system', value: 9, emphasis: false },
]

export function TransferChart() {
  const H = 170
  const barH = 20
  const gap = 2
  const splitX = (TRANSFERRED_SHARE / 100) * W
  const labelW = 96
  const valueW = 42
  const scale = (W - labelW - valueW) / 30

  return (
    <figure className="problem-chart">
      <figcaption className="chart-label">All complaints</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {/* Part-to-whole split, a 2px surface gap between the two segments */}
        <rect className="chart-bar chart-grow" x={0} y={4} width={splitX - gap / 2} height={barH} rx={4}>
          <title>Transferred between systems: 35% (8,870 complaints)</title>
        </rect>
        <rect className="chart-bar is-track" x={splitX + gap / 2} y={4} width={W - splitX - gap / 2} height={barH} rx={4}>
          <title>Handled in one system: 65% (16,546 complaints)</title>
        </rect>
        <text className="chart-value" x={0} y={50}>
          35% transferred
        </text>
        <text className="chart-tick" x={W} y={50} textAnchor="end">
          65% stayed in one system
        </text>

        <text className="chart-label-svg" x={0} y={92}>
          Reopened after closing
        </text>
        {REOPENED.map((row, i) => {
          const rowY = 104 + i * 32
          const width = row.value * scale
          return (
            <g key={row.label}>
              <text className="chart-tick" x={0} y={rowY + 15}>
                {row.label}
              </text>
              <path
                className={`chart-bar chart-grow ${row.emphasis ? '' : 'is-muted'}`}
                d={barPath(labelW, rowY, width, barH)}
              >
                <title>{`${row.label}: ${row.value}% of closed complaints reopened`}</title>
              </path>
              <text className="chart-value" x={labelW + width + 8} y={rowY + 15}>
                {row.value}%
              </text>
            </g>
          )
        })}
      </svg>
      <ChartTable
        caption="Complaints transferred between systems, and reopen rates"
        rows={[
          ['Transferred between systems', '35% of complaints (8,870)'],
          ['Handled in one system', '65% of complaints (16,546)'],
          ['Reopened after closing, transferred', '29% of closed complaints'],
          ['Reopened after closing, one system', '9% of closed complaints'],
        ]}
      />
    </figure>
  )
}

// ─── 51%: complaints by category ────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Billing', count: 12893, emphasis: true },
  { label: 'Service', count: 3626, emphasis: false },
  { label: 'Metering', count: 3120, emphasis: false },
  { label: 'Supply', count: 2192, emphasis: false },
  { label: 'Other', count: 3585, emphasis: false }, // payment 1,601 + water 1,313 + other 671
]
const TOTAL = 25416
const pct = (count: number) => Math.round((count / TOTAL) * 100)

export function BillingShareChart() {
  const H = 170
  const barH = 20
  const pitch = 30
  const labelW = 82
  const valueW = 44
  const scale = (W - labelW - valueW) / CATEGORIES[0].count

  return (
    <figure className="problem-chart">
      <figcaption className="chart-label">Complaints by category</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {CATEGORIES.map((row, i) => {
          const rowY = 4 + i * pitch
          const width = row.count * scale
          return (
            <g key={row.label}>
              <text className="chart-tick" x={0} y={rowY + 15}>
                {row.label}
              </text>
              <path
                className={`chart-bar chart-grow ${row.emphasis ? '' : 'is-muted'}`}
                d={barPath(labelW, rowY, width, barH)}
              >
                <title>{`${row.label}: ${row.count.toLocaleString()} complaints (${pct(row.count)}%)`}</title>
              </path>
              <text className="chart-value" x={labelW + width + 8} y={rowY + 15}>
                {pct(row.count)}%
              </text>
            </g>
          )
        })}
      </svg>
      <ChartTable
        caption="Complaints by category, Oct 2024 to Sep 2026"
        rows={CATEGORIES.map((row) => [row.label, `${row.count.toLocaleString()} (${pct(row.count)}%)`])}
      />
    </figure>
  )
}

// Horizontal bar: square at the baseline, 4px rounded data end
function barPath(x: number, y: number, width: number, height: number) {
  const r = Math.min(4, width / 2)
  return `M${x},${y}H${x + width - r}Q${x + width},${y} ${x + width},${y + r}V${y + height - r}Q${x + width},${y + height} ${x + width - r},${y + height}H${x}Z`
}
