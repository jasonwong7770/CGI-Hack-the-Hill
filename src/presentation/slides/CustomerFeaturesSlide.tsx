import AppScreen from '../ui/AppScreen'
import DataTag, { type DataFile } from '../ui/DataTag'
import Reveal from '../ui/Reveal'
import SlideLayout from '../ui/SlideLayout'

// Each screen is the real component rendered with sample data (see screens/ScreenPreview.tsx)
const FEATURES: { title: string; text: string; screen: string; files: DataFile[] }[] = [
  {
    title: 'Request tracking',
    text: 'File a complaint using Northwind’s own categories, or a maintenance request, and follow it to closed.',
    screen: 'my-requests',
    files: ['A'],
  },
  {
    title: 'Bill breakdown',
    text: 'Every charge on the energy and water bill, and it pops up when you file a billing complaint.',
    screen: 'bill',
    files: ['B'],
  },
  {
    title: 'Appointments',
    text: 'Pick a day and time for a technician visit from a calendar.',
    screen: 'calendar',
    files: ['A'],
  },
]

export default function CustomerFeaturesSlide() {
  return (
    <SlideLayout eyebrow="For customers" title="Self-serve, start to finish">
      <div className="grid-3">
        {FEATURES.map((feature, i) => (
          <Reveal key={feature.title} step={3 + i}>
            <article className="deck-card feature-card">
              <AppScreen
                src={`/presentation/screen/${feature.screen}`}
                title={feature.title}
                viewportWidth={640}
                className="feature-shot"
              />
              <h3>
                {feature.title}
                {feature.files.map((file) => (
                  <DataTag key={file} file={file} />
                ))}
              </h3>
              <p>{feature.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </SlideLayout>
  )
}
