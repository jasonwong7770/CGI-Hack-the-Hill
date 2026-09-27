type Props = { label: string; className?: string }

// Dashed stand-in for a screenshot, photo or chart that hasn't been added yet
export default function Placeholder({ label, className = '' }: Props) {
  return (
    <div className={`placeholder ${className}`.trim()}>
      <span>{label}</span>
    </div>
  )
}
