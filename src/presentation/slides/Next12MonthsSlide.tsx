import Reveal from '../ui/Reveal'

export default function Next12MonthsSlide() {
  return (
    <div className="slide-hero">
      <Reveal step={0}>
        <h2 className="hero-title">
          The Next <span className="accent">12 Months</span>
        </h2>
      </Reveal>
    </div>
  )
}
