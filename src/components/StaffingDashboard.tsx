import { useMemo, useState } from 'react'

type StaffingRow = {
  month: string
  region: string
  agentFte: number
  openVacancies: number
  attritionRate: number
  complaintsPerAgent: number
  note: string
}

const requiredColumns = [
  'month',
  'region',
  'agent_fte',
  'open_vacancies',
  'attrition_rate_12m',
  'complaints_opened_per_agent',
  'note',
]

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"'
        i += 1
      } else if (char === '"') quoted = false
      else cell += char
    } else if (char === '"') quoted = true
    else if (char === ',') {
      row.push(cell.trim())
      cell = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i += 1
      row.push(cell.trim())
      if (row.some((value) => value !== '')) rows.push(row)
      row = []
      cell = ''
    } else cell += char
  }
  row.push(cell.trim())
  if (row.some((value) => value !== '')) rows.push(row)
  return rows
}

function mapStaffingCsv(text: string): StaffingRow[] {
  const [rawHeaders, ...dataRows] = parseCsv(text)
  if (!rawHeaders) throw new Error('The CSV is empty.')
  const headers = rawHeaders.map((header, index) => index === 0 ? header.replace(/^\uFEFF/, '') : header)
  const missing = requiredColumns.filter((column) => !headers.includes(column))
  if (missing.length) throw new Error(`Missing required columns: ${missing.join(', ')}`)

  const index = (name: string) => headers.indexOf(name)
  const number = (cells: string[], name: string, rowNumber: number) => {
    const value = Number(cells[index(name)])
    if (!Number.isFinite(value)) throw new Error(`Row ${rowNumber} has an invalid ${name} value.`)
    return value
  }

  return dataRows.map((cells, rowIndex) => {
    const rowNumber = rowIndex + 2
    const month = cells[index('month')]
    const region = cells[index('region')]
    if (!/^\d{4}-\d{2}$/.test(month) || !region) throw new Error(`Row ${rowNumber} needs a YYYY-MM month and a region.`)
    return {
      month,
      region,
      agentFte: number(cells, 'agent_fte', rowNumber),
      openVacancies: number(cells, 'open_vacancies', rowNumber),
      attritionRate: number(cells, 'attrition_rate_12m', rowNumber),
      complaintsPerAgent: number(cells, 'complaints_opened_per_agent', rowNumber),
      note: cells[index('note')] ?? '',
    }
  })
}

const integer = new Intl.NumberFormat()
const percent = (value: number) => `${(value * 100).toFixed(1)}%`
const chartColors = ['#1c5878', '#c27c37', '#52856f', '#9b5c86', '#7b7c42', '#438d99']
type Metric = 'agents' | 'vacancies' | 'attrition' | 'complaints'

function summarize(rows: StaffingRow[]) {
  const agents = rows.reduce((sum, row) => sum + row.agentFte, 0)
  const vacancies = rows.reduce((sum, row) => sum + row.openVacancies, 0)
  const attrition = agents ? rows.reduce((sum, row) => sum + row.attritionRate * row.agentFte, 0) / agents : 0
  const complaints = agents ? rows.reduce((sum, row) => sum + row.complaintsPerAgent * row.agentFte, 0) / agents : 0
  return { agents, vacancies, attrition, complaints }
}

function formatDelta(current: number, previous: number | undefined, metric: Metric) {
  if (previous === undefined) return 'No earlier month to compare'
  const change = current - previous
  const sign = change > 0 ? '+' : ''
  if (metric === 'attrition') return `${sign}${(change * 100).toFixed(1)} percentage points vs previous month`
  if (metric === 'complaints') return `${sign}${change.toFixed(1)} vs previous month`
  return `${sign}${integer.format(change)} vs previous month`
}

// initialData preloads a CSV (used by the pitch deck's live screens); the app itself starts empty
export default function StaffingDashboard({ initialData }: { initialData?: { fileName: string; csv: string } }) {
  const [rows, setRows] = useState<StaffingRow[]>(() => initialData ? mapStaffingCsv(initialData.csv) : [])
  const [fileName, setFileName] = useState(initialData?.fileName ?? '')
  const [error, setError] = useState<string | null>(null)
  const [monthFilter, setMonthFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('All regions')
  const [chartMetric, setChartMetric] = useState<Metric>('agents')

  const months = useMemo(() => [...new Set(rows.map((row) => row.month))].sort(), [rows])
  const latestMonth = months[months.length - 1] ?? ''
  const selectedMonth = months.includes(monthFilter) ? monthFilter : latestMonth
  const regions = useMemo(() => [...new Set(rows.map((row) => row.region))].sort((a, b) => a.localeCompare(b)), [rows])
  const selectedRows = useMemo(() => rows.filter((row) => row.month === selectedMonth && (regionFilter === 'All regions' || row.region === regionFilter)).sort((a, b) => a.region.localeCompare(b.region)), [rows, selectedMonth, regionFilter])
  const chartRegions = regionFilter === 'All regions' ? regions : [regionFilter]
  const chartWidth = 960
  const chartHeight = 290
  const chartLeft = 48
  const chartRight = 18
  const chartTop = 20
  const chartBottom = 42
  const chartPlotWidth = chartWidth - chartLeft - chartRight
  const chartPlotHeight = chartHeight - chartTop - chartBottom
  const lineSeries = useMemo(() => chartRegions.map((region, seriesIndex) => ({
    region,
    color: chartColors[seriesIndex % chartColors.length],
    points: months.flatMap((month, monthIndex) => {
      const row = rows.find((item) => item.month === month && item.region === region)
      if (!row) return []
      const value = summarize([row])[chartMetric]
      return [{ month, value, monthIndex }]
    }),
  })), [chartRegions, months, rows, chartMetric])
  const chartMax = Math.max(1, ...lineSeries.flatMap((series) => series.points.map((point) => point.value)))
  const yFor = (value: number) => chartTop + (1 - value / chartMax) * chartPlotHeight
  const xForIndex = (index: number) => chartLeft + (months.length <= 1 ? 0 : index / (months.length - 1) * chartPlotWidth)
  const plottedSeries = lineSeries.map((series) => ({
    ...series,
    points: series.points.map((point) => ({ ...point, x: xForIndex(point.monthIndex), y: yFor(point.value) })),
  }))
  const summary = useMemo(() => summarize(selectedRows), [selectedRows])
  const selectedMonthIndex = months.indexOf(selectedMonth)
  const previousMonth = selectedMonthIndex > 0 ? months[selectedMonthIndex - 1] : undefined
  const previousRows = previousMonth ? rows.filter((row) => row.month === previousMonth && (regionFilter === 'All regions' || row.region === regionFilter)) : []
  const previousSummary = previousMonth ? summarize(previousRows) : undefined

  async function readFile(file?: File) {
    if (!file) return
    setError(null)
    try {
      const mappedRows = mapStaffingCsv(await file.text())
      setRows(mappedRows)
      setFileName(file.name)
    } catch (cause) {
      setRows([])
      setFileName('')
      setError(cause instanceof Error ? cause.message : 'Could not read this CSV file.')
    }
  }

  return (
    <section className="card manager-stats">
      <div className="staffing-heading">
        <div>
          <h2>Contact centre staffing</h2>
          <p className="muted">Load the current staffing CSV to refresh the manager view.</p>
        </div>
        <label className="csv-upload">
          <span>{fileName ? 'Replace CSV' : 'Choose CSV'}</span>
          <input type="file" accept=".csv,text/csv" onChange={(event) => { void readFile(event.target.files?.[0]); event.target.value = '' }} />
        </label>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {!rows.length && !error && <p className="muted">Choose <code>northwind_contact_centre_staffing.csv</code> to load staffing data.</p>}
      {rows.length > 0 && <>
        <div className="staffing-filters">
          <label>Month
            <select value={selectedMonth} onChange={(event) => setMonthFilter(event.target.value)}>
              {[...months].reverse().map((month) => <option value={month} key={month}>{month}</option>)}
            </select>
          </label>
          <label>Region
            <select value={regionFilter} onChange={(event) => setRegionFilter(event.target.value)}>
              <option>All regions</option>
              {regions.map((region) => <option value={region} key={region}>{region}</option>)}
            </select>
          </label>
          <span className="muted staffing-source">{selectedRows.length} {selectedRows.length === 1 ? 'region' : 'regions'} · {fileName}</span>
        </div>
        <div className="stat-grid">
          <div className="stat-tile" key={`${selectedMonth}-${regionFilter}-agents`}><span className="stat-value">{integer.format(summary.agents)}</span><span className="stat-label">Agent FTE</span><span className="stat-change">{formatDelta(summary.agents, previousSummary?.agents, 'agents')}</span></div>
          <div className="stat-tile" key={`${selectedMonth}-${regionFilter}-vacancies`}><span className="stat-value">{integer.format(summary.vacancies)}</span><span className="stat-label">Open vacancies</span><span className="stat-change">{formatDelta(summary.vacancies, previousSummary?.vacancies, 'vacancies')}</span></div>
          <div className="stat-tile" key={`${selectedMonth}-${regionFilter}-attrition`}><span className="stat-value">{percent(summary.attrition)}</span><span className="stat-label">12 month attrition</span><span className="stat-change">{formatDelta(summary.attrition, previousSummary?.attrition, 'attrition')}</span></div>
          <div className="stat-tile" key={`${selectedMonth}-${regionFilter}-complaints`}><span className="stat-value">{summary.complaints.toFixed(1)}</span><span className="stat-label">Complaints per agent</span><span className="stat-change">{formatDelta(summary.complaints, previousSummary?.complaints, 'complaints')}</span></div>
        </div>
        <div className="staffing-trend">
          <div className="staffing-trend-heading">
            <div><h3>{chartMetric === 'agents' ? 'Agent FTE by region' : 'Monthly trend by region'}</h3><span className="muted">Monthly changes over time · Select a point to view that month</span></div>
            <label className="staffing-metric-select">Measure
              <select value={chartMetric} onChange={(event) => setChartMetric(event.target.value as Metric)}>
                <option value="agents">Agent FTE</option><option value="vacancies">Open vacancies</option><option value="attrition">12 month attrition</option><option value="complaints">Complaints per agent</option>
              </select>
            </label>
          </div>
          <div className="staffing-line-chart">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="group" aria-label={`${chartMetric} monthly trend by region`}>
              {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
                const value = chartMax * fraction
                return <g key={fraction} className="chart-gridline"><line x1={chartLeft} x2={chartWidth - chartRight} y1={yFor(value)} y2={yFor(value)} /><text x={chartLeft - 8} y={yFor(value) + 4} textAnchor="end">{chartMetric === 'attrition' ? percent(value) : chartMetric === 'complaints' ? value.toFixed(1) : integer.format(value)}</text></g>
              })}
              {months.map((month, index) => index % 3 === 0 || month === selectedMonth ? <g key={month} className="chart-x-tick">
                <line x1={xForIndex(index)} x2={xForIndex(index)} y1={chartTop + chartPlotHeight} y2={chartTop + chartPlotHeight + 5} />
                <text x={xForIndex(index)} y={chartHeight - 12} textAnchor="middle">{month}</text>
              </g> : null)}
              {plottedSeries.map((series) => <g key={series.region} className="chart-series">
                <polyline points={series.points.map((point) => `${point.x},${point.y}`).join(' ')} stroke={series.color} />
                {series.points.map((point) => <circle key={`${series.region}-${point.month}`} cx={point.x} cy={point.y} r={point.month === selectedMonth ? 5 : 3.5} fill={series.color} className={point.month === selectedMonth ? 'selected' : ''} tabIndex={0} role="button" aria-label={`${series.region}, ${point.month}: ${chartMetric === 'attrition' ? percent(point.value) : chartMetric === 'complaints' ? point.value.toFixed(1) : integer.format(point.value)}`} onClick={() => setMonthFilter(point.month)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setMonthFilter(point.month) } }}><title>{`${series.region} · ${point.month} · ${chartMetric === 'attrition' ? percent(point.value) : chartMetric === 'complaints' ? point.value.toFixed(1) : integer.format(point.value)}`}</title></circle>)}
              </g>)}
            </svg>
            <div className="staffing-legend">{plottedSeries.map((series) => <span key={series.region}><i style={{ backgroundColor: series.color }} />{series.region}</span>)}</div>
          </div>
        </div>
        <div className="staffing-table-wrap">
          <table className="staffing-table">
            <thead><tr><th>Region</th><th>Agent FTE</th><th>Vacancies</th><th>Attrition (12m)</th><th>Complaints / agent</th><th>Note</th></tr></thead>
            <tbody>{selectedRows.map((row, index) => <tr key={`${selectedMonth}-${regionFilter}-${row.region}`} style={{ animationDelay: `${index * 45}ms` }}>
              <th scope="row">{row.region}</th><td>{integer.format(row.agentFte)}</td><td>{integer.format(row.openVacancies)}</td><td>{percent(row.attritionRate)}</td><td>{row.complaintsPerAgent.toFixed(1)}</td><td>{row.note || '—'}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </>}
    </section>
  )
}
