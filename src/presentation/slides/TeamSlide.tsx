import alex from '../../assets/team/alex.png'
import elias from '../../assets/team/elias.png'
import ethan from '../../assets/team/ethan.png'
import jason from '../../assets/team/jason.png'
import Reveal from '../ui/Reveal'
import SlideLayout from '../ui/SlideLayout'

// Photos are each member's GitHub avatar
const TEAM = [
  { name: 'Alex Martinez', handle: 'AlexMtzRmz0212', photo: alex },
  { name: 'Jason Wong', handle: 'jasonwong7770', photo: jason },
  { name: 'Ethan Duong', handle: 'ethanduong2007', photo: ethan },
  { name: 'Elias Kassar', handle: 'EliasKassarEducation', photo: elias },
]

export default function TeamSlide() {
  return (
    <SlideLayout eyebrow="The team" title="Who built this">
      <div className="grid-4">
        {TEAM.map((member, i) => (
          <Reveal key={member.handle} step={3 + i}>
            <article className="deck-card team-card">
              <img className="team-avatar" src={member.photo} alt="" />
              <h3>{member.name}</h3>
              <a
                className="team-handle"
                href={`https://github.com/${member.handle}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{member.handle}
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </SlideLayout>
  )
}
