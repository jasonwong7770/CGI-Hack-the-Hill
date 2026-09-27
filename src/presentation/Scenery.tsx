import { memo } from 'react'
import { SLIDE_H, STAGE_W as W } from './constants'
import type { SlideDef } from './types'
import { ZONE_ORDER, ZONE_STYLE, groundIndex, zoneBands, type Band } from './zones'

// Flat placeholder art for the "sky to underground" journey. Every band is positioned from the
// slide zones, so it stays aligned when slides are added or removed. Swap any piece for real
// illustrations later; the slides never depend on it.

const SHAFT_X = 1520 // the maintenance shaft the camera "climbs down", kept clear of slide content

// Deterministic pseudo-random numbers so the scenery is identical on every load
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Horizontal sine line from x0 to x1 around `y`
function waveLine(y: number, amp: number, waves: number, phase = 0, x0 = 0, x1 = W) {
  const steps = 48
  const points: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = x0 + t * (x1 - x0)
    points.push(`${x.toFixed(1)} ${(y + Math.sin(t * Math.PI * 2 * waves + phase) * amp).toFixed(1)}`)
  }
  return `M${points.join(' L')}`
}

// ─── Sky ────────────────────────────────────────────────────────────────────

const CLOUDS: [x: number, yFrac: number, scale: number][] = [
  [210, 0.16, 1.25],
  [560, 0.06, 0.7],
  [1420, 0.43, 0.9],
  [230, 0.58, 1.05],
  [1400, 0.7, 1.35],
  [760, 0.9, 0.8],
]

function Cloud({ x, y, scale, delay }: { x: number; y: number; scale: number; delay: number }) {
  return (
    <g className="scn-drift" style={{ animationDelay: `${delay}s` }}>
      <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#fff" opacity="0.92">
        <ellipse cx="0" cy="0" rx="120" ry="34" />
        <ellipse cx="-52" cy="-18" rx="56" ry="38" />
        <ellipse cx="18" cy="-40" rx="66" ry="50" />
        <ellipse cx="80" cy="-14" rx="46" ry="32" />
      </g>
    </g>
  )
}

function Sky({ band }: { band: Band }) {
  return (
    <g>
      <circle cx="1310" cy={band.y0 + 190} r="330" fill="url(#scn-sun-glow)" />
      <circle cx="1310" cy={band.y0 + 190} r="86" fill="#fff4cf" />
      {CLOUDS.map(([x, yFrac, scale], i) => (
        <Cloud key={i} x={x} y={band.y0 + yFrac * band.h} scale={scale} delay={i * -3.5} />
      ))}
      <g fill="none" stroke="#3d5a6c" strokeWidth="3" strokeLinecap="round">
        {[
          [880, 150],
          [925, 128],
          [962, 160],
        ].map(([x, y]) => (
          <path key={x} d={`M${x} ${band.y0 + y} q8 -8 16 0 q8 -8 16 0`} />
        ))}
      </g>
    </g>
  )
}

// ─── Power lines ────────────────────────────────────────────────────────────

const PYLON_XS = [150, 1450]

function Pylon({ x, top, bottom }: { x: number; top: number; bottom: number }) {
  const halfWidth = (y: number) => 16 + ((y - top) / (bottom - top)) * 54
  let bracing = ''
  for (let y = top; y < bottom - 1; y += 110) {
    const y2 = Math.min(y + 110, bottom)
    bracing += `M${x - halfWidth(y)} ${y} L${x + halfWidth(y2)} ${y2} M${x + halfWidth(y)} ${y} L${x - halfWidth(y2)} ${y2} `
  }
  return (
    <g stroke="#56788b" fill="none" strokeLinejoin="round" strokeLinecap="round">
      <path d={`M${x - 16} ${top} L${x - 70} ${bottom} M${x + 16} ${top} L${x + 70} ${bottom}`} strokeWidth="6" />
      <path d={bracing} strokeWidth="3" opacity="0.75" />
      <path d={`M${x} ${top - 50} L${x - 16} ${top} M${x} ${top - 50} L${x + 16} ${top}`} strokeWidth="5" />
      <path d={`M${x - 130} ${top + 10} H${x + 130} M${x - 100} ${top + 70} H${x + 100}`} strokeWidth="7" />
      <path
        d={`M${x - 130} ${top + 10} v22 M${x + 130} ${top + 10} v22 M${x - 100} ${top + 70} v22 M${x + 100} ${top + 70} v22`}
        stroke="#2c4a5c"
        strokeWidth="5"
      />
    </g>
  )
}

function PowerLines({ band, groundY }: { band: Band; groundY: number }) {
  // Wires hang across the boundary with the slide above, so the power-lines slide itself
  // only shows the towers down its sides and the title stays clear
  const top = Math.max(60, band.y0 - 150)
  const [left, right] = PYLON_XS
  const sag = 70
  const wire = (dx: number, y: number) => {
    const a = left + dx
    const b = right + dx
    return `M${a} ${y} Q${(a + b) / 2} ${y + sag * 2} ${b} ${y}`
  }
  const wires = [
    wire(-130, top + 32),
    wire(130, top + 32),
    wire(-100, top + 92),
    wire(100, top + 92),
  ]
  const offscreen = [
    `M-10 ${top + 60} Q${(left - 130) / 2} ${top + 70} ${left - 130} ${top + 32}`,
    `M${right + 130} ${top + 32} Q${(W + right + 130) / 2} ${top + 70} ${W + 10} ${top + 60}`,
  ]
  return (
    <g>
      {PYLON_XS.map((x) => (
        <Pylon key={x} x={x} top={top} bottom={groundY} />
      ))}
      <g fill="none" stroke="#2c4a5c" strokeWidth="2.5">
        {[...wires, ...offscreen].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {wires.slice(0, 2).map((d, i) => (
        <circle key={d} r="7" fill="#ffd98a" className="scn-pulse">
          <animateMotion dur="3.2s" begin={`${i * 1.3}s`} repeatCount="indefinite" path={d} />
        </circle>
      ))}
    </g>
  )
}

// ─── City (rooftops + street) ───────────────────────────────────────────────

type Building = { x: number; w: number; h: number }

function Buildings({ list, groundY, fill }: { list: Building[]; groundY: number; fill: string }) {
  return (
    <g>
      {list.map((b) => (
        <g key={b.x}>
          <rect x={b.x} y={groundY - b.h} width={b.w} height={b.h} fill={fill} />
          <rect
            x={b.x + 12}
            y={groundY - b.h + 22}
            width={Math.max(0, b.w - 24)}
            height={Math.max(0, b.h - 60)}
            fill="url(#scn-windows)"
          />
        </g>
      ))}
    </g>
  )
}

function City({ groundY, rooftopTop }: { groundY: number; rooftopTop: number }) {
  const rand = seeded(7)
  const far: Building[] = []
  for (let x = -30; x < W; ) {
    const w = 70 + rand() * 90
    far.push({ x, w, h: 260 + rand() * 520 })
    x += w + 6
  }
  const near: Building[] = []
  for (let x = -20; x < W; ) {
    const w = 110 + rand() * 90
    near.push({ x, w, h: 200 + rand() * 380 })
    x += w + 40 + rand() * 70
  }

  // Two landmark towers poke up into the bottom of the rooftops slide, below its text
  const tall = Math.max(600, Math.min(1400, groundY - rooftopTop - 700))
  const towers: Building[] = [
    { x: 280, w: 170, h: tall },
    { x: 1110, w: 150, h: tall * 0.86 },
  ]
  const [a, b] = towers

  return (
    <g>
      <g opacity="0.8">
        <Buildings list={far} groundY={groundY} fill="#c6dde7" />
      </g>
      <Buildings list={towers} groundY={groundY} fill="#86aabd" />
      <Buildings list={near} groundY={groundY} fill="#9fc0d0" />

      {/* Tower A: antenna with a blinking light and rooftop solar panels */}
      <path d={`M${a.x + a.w / 2} ${groundY - a.h} v-120`} stroke="#56788b" strokeWidth="6" />
      <circle cx={a.x + a.w / 2} cy={groundY - a.h - 124} r="8" fill="#e25b45" className="scn-blink" />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${a.x + 14 + i * 52} ${groundY - a.h} l14 -26 h34 l-14 26 z`}
          fill="#2c4a5c"
          stroke="#e3bd70"
          strokeWidth="2"
        />
      ))}

      {/* Tower B: rooftop water tank */}
      <g transform={`translate(${b.x + b.w / 2} ${groundY - b.h})`}>
        <path d="M-40 0 L-30 -60 M40 0 L30 -60 M-35 -30 H35" stroke="#56788b" strokeWidth="5" fill="none" />
        <rect x="-46" y="-140" width="92" height="84" rx="10" fill="#397f9b" />
        <path d="M-50 -140 L0 -176 L50 -140 Z" fill="#2c6a82" />
        <rect x="-46" y="-110" width="92" height="8" fill="#80bbcf" opacity="0.6" />
      </g>
    </g>
  )
}

const LAMP_XS = [240, 700, 1060]

function Street({ groundY }: { groundY: number }) {
  return (
    <g>
      {LAMP_XS.map((x) => (
        <g key={x}>
          <circle cx={x + 40} cy={groundY - 262} r="70" fill="url(#scn-lamp-glow)" />
          <rect x={x - 4} y={groundY - 250} width="8" height="236" fill="#2c4a5c" />
          <path d={`M${x} ${groundY - 246} q0 -22 30 -22 h14`} stroke="#2c4a5c" strokeWidth="7" fill="none" />
          <rect x={x + 30} y={groundY - 272} width="26" height="12" rx="4" fill="#2c4a5c" />
          <rect x={x + 32} y={groundY - 260} width="22" height="5" rx="2" fill="#ffe6a3" />
        </g>
      ))}

      {/* Fire hydrant: a nod to the water side of the business */}
      <g transform={`translate(900 ${groundY - 16})`} fill="#b42318">
        <rect x="-14" y="-58" width="28" height="58" rx="6" />
        <rect x="-22" y="-44" width="44" height="12" rx="5" />
        <path d="M-16 -58 a16 16 0 0 1 32 0 z" />
      </g>

      <rect x="0" y={groundY - 16} width={W} height="16" fill="#cdc3ad" />
      <rect x="0" y={groundY - 16} width={W} height="4" fill="#b3a78d" />
      <rect x={SHAFT_X - 44} y={groundY - 20} width="88" height="7" rx="3" fill="#2f3337" />

      {/* Road cross-section: asphalt, then gravel, then the soil band starts */}
      <rect x="0" y={groundY} width={W} height="44" fill="#3d4349" />
      <rect x="0" y={groundY + 44} width={W} height="40" fill="#8a7560" />
      <rect x="0" y={groundY + 44} width={W} height="40" fill="url(#scn-gravel)" />
    </g>
  )
}

// ─── Underground ────────────────────────────────────────────────────────────

function Soil({ band }: { band: Band }) {
  const rand = seeded(21)
  const pebbles = Array.from({ length: Math.round(band.h / 30) }, () => ({
    x: rand() * W,
    y: band.y0 + 110 + rand() * (band.h - 130),
    rx: 4 + rand() * 9,
    ry: 3 + rand() * 6,
  }))
  return (
    <g>
      {[0.3, 0.58, 0.84].map((f, i) => (
        <path
          key={f}
          d={waveLine(band.y0 + f * band.h, 10, 2.5 + i, i * 1.7)}
          fill="none"
          stroke="#4a3222"
          strokeWidth="3"
          opacity="0.45"
        />
      ))}
      <g fill="#3b2718" opacity="0.35">
        {pebbles.map((p, i) => (
          <ellipse key={i} cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} />
        ))}
      </g>
    </g>
  )
}

type PipeProps = { y: number; t: number; color: string; shade: string; highlight: string; flow?: boolean }

function Pipe({ y, t, color, shade, highlight, flow }: PipeProps) {
  const joints: number[] = []
  for (let x = 140; x < W; x += 280) joints.push(x)
  return (
    <g>
      <rect x="0" y={y - t / 2} width={W} height={t} fill={color} />
      <rect x="0" y={y - t / 2 + t * 0.16} width={W} height={t * 0.16} fill={highlight} opacity="0.55" />
      <rect x="0" y={y + t / 2 - t * 0.22} width={W} height={t * 0.22} fill={shade} opacity="0.55" />
      {joints.map((x) => (
        <rect key={x} x={x - 8} y={y - t / 2 - 5} width="16" height={t + 10} rx="3" fill={shade} />
      ))}
      {flow && (
        <line x1="0" x2={W} y1={y} y2={y} stroke="#d6f1fb" strokeWidth={t * 0.14} opacity="0.6" className="scn-flow" />
      )}
    </g>
  )
}

// Pipes sit below each slide's content: water under the first soil slide, energy under the last
function SoilPipes({ band }: { band: Band }) {
  return (
    <g>
      <Pipe y={band.y0 + Math.min(SLIDE_H - 70, band.h * 0.46)} t={44} color="#397f9b" shade="#245e75" highlight="#9fd4e6" flow />
      <Pipe y={band.y1 - 150} t={24} color="#b98a38" shade="#8a6424" highlight="#f0cf87" />
    </g>
  )
}

function Shaft({ top, bottom }: { top: number; bottom: number }) {
  if (bottom <= top) return null
  return (
    <g>
      <rect x={SHAFT_X - 42} y={top} width="84" height={bottom - top} fill="#15191c" opacity="0.5" />
      <path
        d={`M${SHAFT_X - 42} ${top} V${bottom} M${SHAFT_X + 42} ${top} V${bottom}`}
        stroke="#9a8f80"
        strokeWidth="4"
      />
      <rect x={SHAFT_X - 16} y={top} width="32" height={bottom - top} fill="url(#scn-rungs)" />
      <path
        d={`M${SHAFT_X - 16} ${top} V${bottom} M${SHAFT_X + 16} ${top} V${bottom}`}
        stroke="#c9b98f"
        strokeWidth="4"
      />
    </g>
  )
}

function WaterMain({ band }: { band: Band }) {
  const y = band.y1 - 120
  const t = 130
  const flanges: number[] = []
  for (let x = 200; x < W; x += 340) flanges.push(x)
  const valveY = band.y0 + 260
  return (
    <g>
      {/* Riser feeding the main, with a gate valve */}
      <rect x="63" y={band.y0} width="54" height={y - band.y0} fill="#2f6f89" />
      <rect x="71" y={band.y0} width="9" height={y - band.y0} fill="#7fc0d8" opacity="0.5" />
      <g transform={`translate(90 ${valveY})`} stroke="#e3bd70" strokeWidth="8" fill="none">
        <circle r="46" />
        <path d="M-46 0 H46 M0 -46 V46" strokeWidth="5" />
        <circle r="9" fill="#e3bd70" />
      </g>

      <rect x="0" y={y - t / 2} width={W} height={t} fill="url(#scn-main)" />
      {flanges.map((x) => (
        <rect key={x} x={x - 14} y={y - t / 2 - 12} width="28" height={t + 24} rx="4" fill="#1f5268" />
      ))}
      <line x1="0" x2={W} y1={y - 22} y2={y - 22} stroke="#bfe6f3" strokeWidth="6" opacity="0.5" className="scn-flow-fast" />
      <line x1="0" x2={W} y1={y + 24} y2={y + 24} stroke="#bfe6f3" strokeWidth="4" opacity="0.35" className="scn-flow-fast" />
    </g>
  )
}

function Bedrock({ band }: { band: Band }) {
  const rand = seeded(42)
  const rocks = Array.from({ length: Math.round(band.h / 40) }, (_, i) => {
    const cx = rand() * W
    const cy = band.y0 + rand() * band.h
    const r = 40 + rand() * 80
    const points = Array.from({ length: 6 }, (_, k) => {
      const angle = (k / 6) * Math.PI * 2 + rand() * 0.6
      const radius = r * (0.7 + rand() * 0.4)
      return `${(cx + Math.cos(angle) * radius).toFixed(1)},${(cy + Math.sin(angle) * radius * 0.7).toFixed(1)}`
    })
    return { points: points.join(' '), fill: i % 2 ? '#2e3440' : '#39404c' }
  })
  const cracks = Array.from({ length: 6 }, () => {
    let x = rand() * W
    let y = band.y0 + rand() * band.h
    let d = `M${x.toFixed(1)} ${y.toFixed(1)}`
    for (let k = 0; k < 5; k++) {
      x += 30 + rand() * 60
      y += (rand() - 0.4) * 60
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`
    }
    return d
  })
  return (
    <g>
      <g opacity="0.55">
        {rocks.map((rock) => (
          <polygon key={rock.points} points={rock.points} fill={rock.fill} />
        ))}
      </g>
      <g fill="none" stroke="#171b22" strokeWidth="3" opacity="0.7">
        {cracks.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </g>
  )
}

function BedrockCables({ band }: { band: Band }) {
  const cables = [
    { y: band.y0 + 80, color: '#e3bd70' },
    { y: band.y0 + 112, color: '#80bbcf' },
    { y: band.y1 - 90, color: '#e3bd70' },
  ]
  return (
    <g>
      {cables.map(({ y, color }, i) => (
        <g key={y}>
          <line x1="0" x2={W} y1={y} y2={y} stroke={color} strokeWidth="16" opacity="0.12" />
          <line x1="0" x2={W} y1={y} y2={y} stroke={color} strokeWidth="4" />
          <circle r="6" fill={color} className="scn-pulse">
            <animateMotion dur="2.6s" begin={`${i * 0.7}s`} repeatCount="indefinite" path={`M0 ${y} H${W}`} />
          </circle>
        </g>
      ))}
    </g>
  )
}

function Reservoir({ band }: { band: Band }) {
  const rand = seeded(99)
  const ceiling = band.y0 + 60
  const tips: { x: number; y: number }[] = []
  let ceilingPath = `M0 ${band.y0} H${W} V${ceiling}`
  for (let x = W; x > 0; x -= 80) {
    const tipY = ceiling + 30 + rand() * 110
    tips.push({ x: x - 40, y: tipY })
    ceilingPath += ` L${x - 40} ${tipY.toFixed(1)} L${x - 80} ${ceiling}`
  }
  ceilingPath += ' Z'

  const wall = (side: 'left' | 'right') => {
    const steps = 30
    const points: string[] = []
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const inset = 60 + Math.sin(t * 9 + (side === 'left' ? 0 : 2)) * 28 + Math.sin(t * 23) * 10
      points.push(`${side === 'left' ? inset : W - inset} ${(band.y0 + t * band.h).toFixed(1)}`)
    }
    const edge = side === 'left' ? 0 : W
    return `M${edge} ${band.y0} L${points.join(' L')} L${edge} ${band.y1} Z`
  }

  const surface = band.y1 - 250
  const drips = tips.filter((_, i) => i % 5 === 2).slice(0, 3)

  return (
    <g>
      <ellipse cx="800" cy={band.y1 - 300} rx="900" ry="560" fill="url(#scn-res-glow)" />
      <path d={ceilingPath} fill="#141a22" />
      <path d={wall('left')} fill="#141a22" />
      <path d={wall('right')} fill="#141a22" />

      {drips.map((tip, i) => (
        <circle key={tip.x} cx={tip.x} cy={tip.y} r="4" fill="#9fd4e6" className="scn-pulse">
          <animate attributeName="cy" from={tip.y} to={surface} dur="2.8s" begin={`${i * 0.9}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" dur="2.8s" begin={`${i * 0.9}s`} repeatCount="indefinite" />
        </circle>
      ))}

      <g className="scn-wave-a">
        <path
          d={`${waveLine(surface - 12, 9, 5, 1, -200, W + 200)} L${W + 200} ${band.y1} L-200 ${band.y1} Z`}
          fill="#1f6f8b"
          opacity="0.55"
        />
      </g>
      <g className="scn-wave-b">
        <path
          d={`${waveLine(surface, 8, 4, 0, -200, W + 200)} L${W + 200} ${band.y1} L-200 ${band.y1} Z`}
          fill="url(#scn-water)"
        />
      </g>
      <g stroke="#bfe9f7" strokeWidth="3" strokeLinecap="round" className="scn-shimmer">
        {[260, 520, 800, 1060, 1320].map((x, i) => (
          <line key={x} x1={x} x2={x + 60 + (i % 2) * 40} y1={surface + 40 + (i % 3) * 36} y2={surface + 40 + (i % 3) * 36} />
        ))}
      </g>
    </g>
  )
}

// ─── Assembly ───────────────────────────────────────────────────────────────

function Scenery({ slides }: { slides: SlideDef[] }) {
  const height = slides.length * SLIDE_H
  const bands = zoneBands(slides)
  const groundY = groundIndex(slides) * SLIDE_H
  const aboveGround = groundY > 0
  const shaftBottom = bands.reservoir ? bands.reservoir.y0 + 80 : height

  return (
    <svg className="scenery" width={W} height={height} viewBox={`0 0 ${W} ${height}`} aria-hidden="true">
      <defs>
        {ZONE_ORDER.map((zone) => (
          <linearGradient key={zone} id={`scn-bg-${zone}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={ZONE_STYLE[zone].from} />
            <stop offset="1" stopColor={ZONE_STYLE[zone].to} />
          </linearGradient>
        ))}
        <radialGradient id="scn-sun-glow">
          <stop offset="0" stopColor="#fff6d8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff6d8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="scn-lamp-glow">
          <stop offset="0" stopColor="#ffe6a3" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffe6a3" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="scn-res-glow">
          <stop offset="0" stopColor="#3aa6c9" stopOpacity="0.45" />
          <stop offset="1" stopColor="#3aa6c9" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="scn-main" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5aa6c2" />
          <stop offset="0.45" stopColor="#2f6f89" />
          <stop offset="1" stopColor="#1d4f63" />
        </linearGradient>
        <linearGradient id="scn-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a8fb0" />
          <stop offset="1" stopColor="#0b2433" />
        </linearGradient>
        <pattern id="scn-windows" width="34" height="46" patternUnits="userSpaceOnUse">
          <rect x="10" y="12" width="14" height="20" rx="2" fill="#eef6f9" opacity="0.75" />
        </pattern>
        <pattern id="scn-rungs" x={SHAFT_X - 16} y="0" width="32" height="36" patternUnits="userSpaceOnUse">
          <rect x="0" y="16" width="32" height="4" fill="#c9b98f" />
        </pattern>
        <pattern id="scn-gravel" width="26" height="20" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="3" fill="#6b5847" />
          <circle cx="19" cy="14" r="2.5" fill="#a58f78" />
        </pattern>
      </defs>

      {ZONE_ORDER.map((zone) => {
        const band = bands[zone]
        return band && <rect key={zone} x="0" y={band.y0} width={W} height={band.h} fill={`url(#scn-bg-${zone})`} />
      })}

      {bands.sky && <Sky band={bands.sky} />}
      {bands.powerlines && aboveGround && <PowerLines band={bands.powerlines} groundY={groundY} />}
      {aboveGround && <City groundY={groundY} rooftopTop={bands.rooftops?.y0 ?? groundY - 2 * SLIDE_H} />}

      {bands.soil && <Soil band={bands.soil} />}
      {bands.bedrock && <Bedrock band={bands.bedrock} />}
      {bands.reservoir && <Reservoir band={bands.reservoir} />}
      {aboveGround && <Street groundY={groundY} />}
      {aboveGround && <Shaft top={groundY} bottom={shaftBottom} />}
      {bands.soil && <SoilPipes band={bands.soil} />}
      {bands.watermain && <WaterMain band={bands.watermain} />}
      {bands.bedrock && <BedrockCables band={bands.bedrock} />}
    </svg>
  )
}

export default memo(Scenery)
