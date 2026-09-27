import Reveal from '../ui/Reveal'
import SlideLayout from '../ui/SlideLayout'

// Figures from the CGI challenge data; the dollar figure is an estimate, explained in the footnote
const IMPACT = [
  'No more hand-offs: 35% of complaints bounce between systems today, worth up to ~$235K a year*',
  'Billing questions answered up front: 23% of complaints only needed information',
  'Hot spots like Calderfield (41% attrition) visible before service slips',
]
const NEXT = [
  'Save appointments to the database',
  'Real billing data instead of demo numbers',
  'Email / SMS updates when a request changes',
  'REST API framework linking Northwind Connect, CallCentre One, FieldForce and PeopleBase (B)',
  'RAG pipeline grounded in real account data, where the AskNorthwind pilot failed (E)',
  'Assign requests and track SLAs (77% breached today)',
  'Store staffing data in Supabase, not a CSV upload',
]

export default function ImpactSlide() {
  return (
    <SlideLayout eyebrow="Impact & what’s next" title="Where this goes from here">
      <div className="grid-2">
        <Reveal step={3}>
          <article className="deck-card">
            <h3>Impact</h3>
            <ul className="deck-list compact">
              {IMPACT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </Reveal>
        <Reveal step={4}>
          <article className="deck-card">
            <h3>Next steps</h3>
            <ul className="deck-list compact">
              {NEXT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>
      <Reveal step={5}>
        <p className="slide-source">
          * Estimate: ~4,435 transfers a year × $53 extra each ($121 vs $68 per complaint, Northwind FY26 cost model)
        </p>
      </Reveal>
    </SlideLayout>
  )
}
