import logo from '../../assets/logo.png'
import Reveal from '../ui/Reveal'

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
        {/* TODO: final tagline */}
        <p className="slide-lead">
          One portal for every energy and water request, from the first call to the closed ticket.
        </p>
      </Reveal>
      <Reveal step={5}>
        <p className="hero-hint">
          Press <kbd>Space</kbd> to descend
        </p>
      </Reveal>
    </div>
  )
}
