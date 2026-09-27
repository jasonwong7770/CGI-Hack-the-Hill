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
        <p className="slide-lead">Questions?</p>
      </Reveal>
      <Reveal step={3}>
        {/* TODO: repo link, Devpost link, team handles */}
        <p className="hero-links">github.com/your-team/your-repo · devpost.com/software/your-project</p>
      </Reveal>
    </div>
  )
}
