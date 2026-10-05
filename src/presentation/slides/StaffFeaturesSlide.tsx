import AppScreen from '../ui/AppScreen'
import DataTag, { type DataFile } from '../ui/DataTag'
import Reveal from '../ui/Reveal'
import SlideLayout from '../ui/SlideLayout'
import { href } from '../../routes'

// Each screen is the real component rendered with sample data (see screens/ScreenPreview.tsx)
const FEATURES: { title: string; text: string; screen: string; files: DataFile[] }[] = [
  {
    title: 'Employees: one shared queue',
    text: 'Every customer request in one list, closed with a click, instead of four systems per call.',
    screen: 'queue',
    files: ['B'],
  },
  {
    title: 'Managers: staffing, stats and access',
    text: 'Vacancies, attrition and complaints per agent by region, plus request totals and role management.',
    screen: 'staffing',
    files: ['G'],
  },
]

export default function StaffFeaturesSlide() {
  return (
    <SlideLayout eyebrow="For staff" title="Close the loop faster">
      <div className="grid-2">
        {FEATURES.map((feature, i) => (
          <Reveal key={feature.title} step={3 + i}>
            <article className="deck-card feature-card">
              <AppScreen
                src={href(`presentation/screen/${feature.screen}`)}
                title={feature.title}
                viewportWidth={960}
                className="feature-shot tall"
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
