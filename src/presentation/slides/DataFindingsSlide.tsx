import DataTag, { DATA_FILES, type DataFile } from '../ui/DataTag'
import Reveal from '../ui/Reveal'
import SlideLayout from '../ui/SlideLayout'

// The root cause each challenge CSV exposed, and the fix it led to (next slide)
const FINDINGS: { file: DataFile; stat: string; text: string; leadsTo: string }[] = [
  {
    file: 'A',
    stat: '1,718',
    text: 'complaints are missed appointments, and 71% of those breach SLA',
    leadsTo: 'Appointment calendar',
  },
  {
    file: 'B',
    stat: '1998',
    text: 'COBOL still runs billing, and the REST systems around it aren’t linked',
    leadsTo: 'Bill breakdown, REST API framework',
  },
  {
    file: 'E',
    stat: '10%',
    text: 'of AI assistant chats were resolved by the end of the pilot; CSAT 2.0/5, now paused',
    leadsTo: 'RAG pipeline',
  },
  {
    file: 'G',
    stat: '41%',
    text: 'attrition in Calderfield, with 32 vacancies and 5.5 complaints per agent',
    leadsTo: 'Staff data analysis',
  },
]

export default function DataFindingsSlide() {
  return (
    <SlideLayout eyebrow="From the data" title="What the data pointed us to">
      <div className="grid-4">
        {FINDINGS.map((finding, i) => (
          <Reveal key={finding.file} step={3 + i}>
            <article className="deck-card stat-card finding-card">
              <DataTag file={finding.file} full />
              <strong className="stat">{finding.stat}</strong>
              <p>{finding.text}</p>
              <p className="finding-fix">
                <span>Fix</span>
                {finding.leadsTo}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal step={8}>
        <p className="slide-source data-legend-line">
          Challenge files:{' '}
          {(Object.keys(DATA_FILES) as DataFile[]).map((file) => (
            <DataTag key={file} file={file} full />
          ))}
        </p>
      </Reveal>
    </SlideLayout>
  )
}
