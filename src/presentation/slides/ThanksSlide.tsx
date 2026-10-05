import Reveal from '../ui/Reveal'

export default function ThanksSlide() {
  return (
    <div className="slide-hero">
      <Reveal step={0}>
        <p className="slide-eyebrow">Northwind Utilities</p>
      </Reveal>
      <Reveal step={1}>
        <h2 className="hero-title">
          Thank <span className="accent">you</span>
        </h2>
      </Reveal>
      <Reveal step={2}>
        <p className="hero-links">
          <a href="https://github.com/jasonwong7770/CGI-Hack-the-Hill" target="_blank" rel="noopener noreferrer">
            github.com/jasonwong7770/CGI-Hack-the-Hill
          </a>
          {' · '}
          <a href="https://devpost.com/software/fixtheflow" target="_blank" rel="noopener noreferrer">
            devpost.com/software/fixtheflow
          </a>
        </p>
      </Reveal>
    </div>
  )
}
