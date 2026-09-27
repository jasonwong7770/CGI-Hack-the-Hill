// The CGI challenge CSVs, lettered so slides can cite them in a few characters
export const DATA_FILES = {
  A: 'complaints.csv',
  B: 'systems.csv',
  C: 'monthly.csv',
  D: 'meter_reads.csv',
  E: 'ai_pilot_2025.csv',
  F: 'unit_costs.csv',
  G: 'contact_centre_staffing.csv',
} as const

export type DataFile = keyof typeof DATA_FILES

// Small lettered chip; hover shows the file name
export default function DataTag({ file, full = false }: { file: DataFile; full?: boolean }) {
  return (
    <span className="data-tag" title={DATA_FILES[file]}>
      <b>{file}</b>
      {full && <span>{DATA_FILES[file]}</span>}
    </span>
  )
}
