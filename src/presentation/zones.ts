import { SLIDE_H } from './constants'
import type { SlideDef, Zone } from './types'

type ZoneStyle = { from: string; to: string; underground: boolean; label: string }

// Background gradient for each band; each band starts where the previous one ends
export const ZONE_STYLE: Record<Zone, ZoneStyle> = {
  sky: { from: '#8fcbe8', to: '#b9e0f1', underground: false, label: 'Sky' },
  powerlines: { from: '#b9e0f1', to: '#d3ecf5', underground: false, label: 'Power lines' },
  rooftops: { from: '#d3ecf5', to: '#e9f0ea', underground: false, label: 'Rooftops' },
  street: { from: '#e9f0ea', to: '#f6e8cc', underground: false, label: 'Street level' },
  soil: { from: '#7b5639', to: '#5b3f2b', underground: true, label: 'Topsoil & pipes' },
  watermain: { from: '#5b3f2b', to: '#3b3130', underground: true, label: 'Water main' },
  bedrock: { from: '#3b3130', to: '#232a35', underground: true, label: 'Bedrock' },
  reservoir: { from: '#232a35', to: '#0b1822', underground: true, label: 'Reservoir' },
}

export const ZONE_ORDER = Object.keys(ZONE_STYLE) as Zone[]

export type Band = { y0: number; y1: number; h: number }

// Pixel range each zone covers on the track, derived from the slides that use it
export function zoneBands(slides: SlideDef[]) {
  const bands: Partial<Record<Zone, Band>> = {}
  slides.forEach((slide, i) => {
    const y0 = i * SLIDE_H
    const y1 = y0 + SLIDE_H
    const band = bands[slide.zone]
    const start = band ? Math.min(band.y0, y0) : y0
    const end = band ? Math.max(band.y1, y1) : y1
    bands[slide.zone] = { y0: start, y1: end, h: end - start }
  })
  return bands
}

// Index of the first slide below street level
export function groundIndex(slides: SlideDef[]) {
  const i = slides.findIndex((slide) => ZONE_STYLE[slide.zone].underground)
  return i === -1 ? slides.length : i
}
