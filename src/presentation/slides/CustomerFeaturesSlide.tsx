import Placeholder from '../ui/Placeholder'
import Reveal from '../ui/Reveal'
import SlideLayout from '../ui/SlideLayout'

// TODO: swap placeholders for screenshots of each feature
const FEATURES = [
  {
    title: 'Request tracking',
    text: 'File a complaint or maintenance request and follow it from open to closed.',
    shot: 'Screenshot: request list',
  },
  {
    title: 'Bill breakdown',
    text: 'See exactly where every dollar of the water and energy bill goes.',
    shot: 'Screenshot: bill breakdown',
  },
  {
    title: 'Appointments',
    text: 'Pick a day and time for a technician visit from a calendar.',
    shot: 'Screenshot: calendar',
  },
]

export default function CustomerFeaturesSlide() {
  return (
    <SlideLayout eyebrow="For customers" title="Self-serve, start to finish">
      <div className="grid-3">
        {FEATURES.map((feature, i) => (
          <Reveal key={feature.title} step={3 + i}>
            <article className="deck-card feature-card">
              <Placeholder label={feature.shot} className="feature-shot" />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </SlideLayout>
  )
}
