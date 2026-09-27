import DataTag, { type DataFile } from '../ui/DataTag'
import Reveal from '../ui/Reveal'
import SlideLayout from '../ui/SlideLayout'

type Fix = { name: string; built: boolean; files: DataFile[]; detail?: string }

// Each dashboard, the fixes it carries, and the challenge CSV each fix answers
const DASHBOARDS: { code: string; name: string; fixes: Fix[] }[] = [
  {
    code: 'CD',
    name: 'Customer',
    fixes: [
      { name: 'Appointment calendar', built: true, files: ['A'] },
      { name: 'Bill breakdown', built: true, files: ['B'], detail: 'COBOL billing' },
      { name: 'REST API framework', built: false, files: ['B'], detail: 'Northwind Connect' },
      { name: 'RAG pipeline', built: false, files: ['E'] },
    ],
  },
  {
    code: 'ED',
    name: 'Employee',
    fixes: [
      { name: 'Shared request queue', built: true, files: ['B'] },
      { name: 'REST API framework', built: false, files: ['B'], detail: 'CallCentre One, FieldForce' },
    ],
  },
  {
    code: 'MD',
    name: 'Manager',
    fixes: [
      { name: 'Staff data analysis', built: true, files: ['G'] },
      { name: 'REST API framework', built: false, files: ['B'], detail: 'PeopleBase' },
    ],
  },
]

// Which files a dashboard answers, derived from its fixes
const filesFor = (fixes: Fix[]) => [...new Set(fixes.flatMap((fix) => fix.files))].sort()

export default function DataMapSlide() {
  return (
    <SlideLayout eyebrow="Data → fixes" title="How each dashboard answers it">
      <div className="grid-3">
        {DASHBOARDS.map((board, i) => (
          <Reveal key={board.code} step={3 + i}>
            <article className="deck-card board-card">
              <header>
                <span className="role-badge">{board.code}</span>
                <h3>{board.name}</h3>
              </header>
              <ul className="board-fixes">
                {board.fixes.map((fix) => (
                  <li key={fix.name}>
                    <span className="board-fix-name">
                      {fix.name}
                      {fix.detail && <small>{fix.detail}</small>}
                    </span>
                    <em className={fix.built ? 'status built' : 'status next'}>{fix.built ? 'Built' : 'Next'}</em>
                    {fix.files.map((file) => (
                      <DataTag key={file} file={file} />
                    ))}
                  </li>
                ))}
              </ul>
              <p className="board-solves">
                Solves
                {filesFor(board.fixes).map((file) => (
                  <DataTag key={file} file={file} />
                ))}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </SlideLayout>
  )
}
