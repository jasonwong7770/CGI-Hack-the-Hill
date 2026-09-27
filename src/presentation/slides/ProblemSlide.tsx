import Reveal from '../ui/Reveal'
import SlideLayout from '../ui/SlideLayout'

// TODO: replace with real stats and sources
const PAINS = [
  { stat: '00%', text: 'of customers who call more than once about the same issue' },
  { stat: '00 min', text: 'average wait on hold to report an outage or leak' },
  { stat: '0 in 0', text: 'customers who don’t understand their monthly bill' },
]

export default function ProblemSlide() {
  return (
    <SlideLayout
      eyebrow="The problem"
      title="Getting help from your utility shouldn’t take three phone calls"
      lead="TODO: one or two sentences on why customers and staff struggle today."
    >
      <div className="grid-3">
        {PAINS.map((pain, i) => (
          <Reveal key={pain.text} step={3 + i}>
            <article className="deck-card stat-card">
              <strong className="stat">{pain.stat}</strong>
              <p>{pain.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </SlideLayout>
  )
}
