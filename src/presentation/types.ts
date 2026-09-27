import type { ComponentType } from 'react'

// Depth bands of the illustrated world, top (sky) to bottom (reservoir)
export type Zone =
  | 'sky'
  | 'powerlines'
  | 'rooftops'
  | 'street'
  | 'soil'
  | 'watermain'
  | 'bedrock'
  | 'reservoir'

export type SlideProps = { active: boolean }

export type SlideDef = {
  id: string // used in the URL hash, e.g. /presentation#problem
  title: string
  zone: Zone
  notes?: string // shown in the presenter HUD (T key)
  Component: ComponentType<SlideProps>
}
