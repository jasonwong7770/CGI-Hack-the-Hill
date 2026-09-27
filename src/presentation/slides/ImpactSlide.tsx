import Reveal from '../ui/Reveal'
import SlideLayout from '../ui/SlideLayout'

// TODO: real impact numbers and roadmap
const IMPACT = [
  'Fewer repeat calls about the same issue',
  'Faster time to close a request',
  'Clearer bills, fewer billing disputes',
]
const NEXT = [
  'Save appointments to the database',
  'Real billing data instead of demo numbers',
  'Email / SMS updates when a request changes',
]

export default function ImpactSlide() {
  return (
    <SlideLayout eyebrow="Impact & what’s next" title="Where this goes from here">
      <div className="grid-2">
        <Reveal step={3}>
          <article className="deck-card">
            <h3>Impact</h3>
            <ul className="deck-list">
              {IMPACT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </Reveal>
        <Reveal step={4}>
          <article className="deck-card">
            <h3>Next steps</h3>
            <ul className="deck-list">
              {NEXT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>
    </SlideLayout>
  )
}
