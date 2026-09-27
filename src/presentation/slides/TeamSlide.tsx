import Reveal from '../ui/Reveal'
import SlideLayout from '../ui/SlideLayout'

// TODO: real names, roles and photos (drop images in src/assets and swap the avatar div for an <img>)
const TEAM = [
  { name: 'Teammate 1', role: 'Role / focus' },
  { name: 'Teammate 2', role: 'Role / focus' },
  { name: 'Teammate 3', role: 'Role / focus' },
  { name: 'Teammate 4', role: 'Role / focus' },
]

export default function TeamSlide() {
  return (
    <SlideLayout eyebrow="The team" title="Who built this">
      <div className="grid-4">
        {TEAM.map((member, i) => (
          <Reveal key={member.name} step={3 + i}>
            <article className="deck-card team-card">
              <div className="team-avatar" aria-hidden="true">
                {member.name.charAt(0)}
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </SlideLayout>
  )
}
