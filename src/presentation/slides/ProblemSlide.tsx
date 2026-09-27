import type { ReactNode } from 'react'
import DataTag from '../ui/DataTag'
import Reveal from '../ui/Reveal'
import SlideLayout from '../ui/SlideLayout'
import { BillingShareChart, DaysToCloseChart, TransferChart } from './ProblemCharts'

// From the CGI challenge data: complaints (A), systems (B), monthly KPIs (C)
const PAINS: { stat: string; text: string; chart: ReactNode }[] = [
  { stat: '5×', text: 'longer to close a complaint than two years ago', chart: <DaysToCloseChart /> },
  { stat: '35%', text: 'of complaints bounce between systems; those reopen 3× as often', chart: <TransferChart /> },
  { stat: '51%', text: 'of complaints are about billing, but the portal can’t break down a bill', chart: <BillingShareChart /> },
]

export default function ProblemSlide() {
  return (
    <SlideLayout eyebrow="The problem" title="A complaint now takes 43.8 days to close">
      <div className="grid-3">
        {PAINS.map((pain, i) => (
          <Reveal key={pain.stat} step={3 + i}>
            <article className="deck-card stat-card problem-card">
              <strong className="stat">{pain.stat}</strong>
              <p>{pain.text}</p>
              {pain.chart}
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal step={6}>
        <p className="slide-source">
          Source: Northwind Utilities challenge data (1.8M customers), 25,416 complaints, Oct 2024 – Sep 2026 · files{' '}
          <DataTag file="A" /> <DataTag file="B" /> <DataTag file="C" />
        </p>
      </Reveal>
    </SlideLayout>
  )
}
