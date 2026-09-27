import logo from '../../assets/logo.png'
import alex from '../../assets/team/alex.png'
import elias from '../../assets/team/elias.png'
import ethan from '../../assets/team/ethan.png'
import jason from '../../assets/team/jason.png'
import Reveal from '../ui/Reveal'

// Photos are each member's GitHub avatar
const TEAM = [
  { name: 'Alex Martinez', handle: 'AlexMtzRmz0212', photo: alex },
  { name: 'Jason Wong', handle: 'jasonwong7770', photo: jason },
  { name: 'Ethan Duong', handle: 'ethanduong2007', photo: ethan },
  { name: 'Elias Kassar', handle: 'EliasKassarEducation', photo: elias },
]

export default function TitleSlide() {
  return (
    <div className="slide-hero">
      <Reveal step={0}>
        <img className="hero-logo" src={logo} alt="" />
      </Reveal>
      <Reveal step={1}>
        <p className="slide-eyebrow">CGI CRM Challenge · Hack the Hill III</p>
      </Reveal>
      <Reveal step={2}>
        <h1 className="hero-title">
          Northwind <span className="accent">Utilities</span>
        </h1>
      </Reveal>
      <Reveal step={3}>
        <p className="slide-lead">
          One portal for every energy and water request, from the first call to the closed ticket.
        </p>
      </Reveal>
      <Reveal step={5}>
        <ul className="hero-team" aria-label="Built by">
          {TEAM.map((member) => (
            <li key={member.handle}>
              <a
                href={`https://github.com/${member.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`@${member.handle}`}
              >
                <img src={member.photo} alt="" />
                {member.name}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal step={7}>
        <p className="hero-hint">
          Press <kbd>Space</kbd> to descend
        </p>
      </Reveal>
    </div>
  )
}
