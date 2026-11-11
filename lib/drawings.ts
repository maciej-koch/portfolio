// Line art the dust can settle on. Each drawing is a list of segments in "drawing units": centered on (0, 0),
// at most 1.35 units tall and about 1 unit wide (Particles scales it to the avatar's spot).
type Seg = [number, number, number, number]

function pen() {
  const segs: Seg[] = []
  const line = (x1: number, y1: number, x2: number, y2: number) => segs.push([x1, y1, x2, y2])
  const poly = (pts: number[][]) => pts.slice(1).forEach((p, i) => line(pts[i][0], pts[i][1], p[0], p[1]))
  const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n: number) =>
    poly(Array.from({ length: n + 1 }, (_, i) => {
      const a = a0 + ((a1 - a0) * i) / n
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
    }))
  const star = (cx: number, cy: number, r: number, rays: number) => {
    for (let i = 0; i < rays; i++) line(cx, cy, cx + r * Math.cos((i / rays) * Math.PI * 2), cy + r * Math.sin((i / rays) * Math.PI * 2))
  }
  return { segs, line, poly, arc, star }
}

// The Doors of Durin: pillars at x = ±0.5, threshold at y = -0.675, stars up to y ≈ 0.6.
function doors() {
  const { segs, line, poly, arc, star } = pen()
  const dy = -0.075 // the drawing spans -0.6..0.75 before centering
  // frame: a double arch on two pillars, and the threshold
  for (const r of [0.5, 0.43]) {
    arc(0, 0.25 + dy, r, 0, Math.PI, 28)
    line(-r, 0.25 + dy, -r, -0.6 + dy)
    line(r, 0.25 + dy, r, -0.6 + dy)
  }
  line(-0.5, -0.6 + dy, 0.5, -0.6 + dy)
  // the inscription runs along the arch: scattered dots between the two arcs
  for (let i = 0; i < 40; i++) {
    const a = 0.15 + Math.random() * (Math.PI - 0.3)
    const r = 0.445 + Math.random() * 0.04
    line(r * Math.cos(a), 0.25 + dy + r * Math.sin(a), r * Math.cos(a) + 0.004, 0.25 + dy + r * Math.sin(a))
  }
  // the two trees of the High Elves, each with a crescent moon
  for (const sx of [-1, 1]) {
    const x = sx * 0.3
    line(x, -0.55 + dy, x, 0.05 + dy)
    for (const [y, w] of [
      [-0.4, 0.11],
      [-0.24, 0.1],
      [-0.08, 0.08],
    ]) {
      line(x, y + dy, x - w, y + dy + w * 1.3)
      line(x, y + dy, x + w, y + dy + w * 1.3)
    }
    arc(x, 0.13 + dy, 0.05, 0.4, 2 * Math.PI - 0.9, 10)
  }
  // Durin's crown with seven stars above it
  poly(
    [
      [-0.14, 0.3],
      [-0.14, 0.34],
      [-0.095, 0.44],
      [-0.05, 0.34],
      [0, 0.47],
      [0.05, 0.34],
      [0.095, 0.44],
      [0.14, 0.34],
      [0.14, 0.3],
      [-0.14, 0.3],
    ].map(([x, y]) => [x, y + dy]),
  )
  for (let k = 0; k < 7; k++) {
    const a = Math.PI * (0.15 + (0.7 * k) / 6)
    star(0.27 * Math.cos(a), 0.36 + dy + 0.22 * Math.sin(a), 0.022, 4)
  }
  // the Star of Fëanor
  star(0, 0.08 + dy, 0.1, 8)
  // anvil and hammer
  poly(
    [
      [-0.09, -0.24],
      [0.09, -0.24],
      [0.06, -0.3],
      [0.06, -0.36],
      [-0.06, -0.36],
      [-0.06, -0.3],
      [-0.09, -0.24],
    ].map(([x, y]) => [x, y + dy]),
  )
  line(0.0, -0.2 + dy, 0.13, -0.07 + dy)
  line(0.09, -0.14 + dy, 0.17, -0.06 + dy)
  return segs.map((s) => s.map((v) => v * 0.85) as Seg) // a bit smaller than the rest: at full height it touches the text on phones
}

// The Deathly Hallows: the Elder Wand inside the Resurrection Stone inside the Cloak of Invisibility.
function hallows() {
  const { segs, line, poly, arc } = pen()
  const h = 1.1
  const top = 0.55
  const base = top - h
  const half = h / Math.sqrt(3) // equilateral
  poly([
    [0, top],
    [half, base],
    [-half, base],
    [0, top],
  ])
  arc(0, base + h / 3, h / 3, 0, 2 * Math.PI, 48) // inscribed circle
  line(0, top, 0, base)
  return segs
}

// A trophy for finding every easter egg.
function trophy() {
  const { segs, line, poly, arc, star } = pen()
  arc(0, 0.3, 0.36, Math.PI, 2 * Math.PI, 24) // bowl
  line(-0.36, 0.3, -0.36, 0.5)
  line(0.36, 0.3, 0.36, 0.5)
  line(-0.36, 0.5, 0.36, 0.5) // rim
  arc(-0.36, 0.3, 0.16, Math.PI / 2, (3 * Math.PI) / 2, 12) // handles
  arc(0.36, 0.3, 0.16, -Math.PI / 2, Math.PI / 2, 12)
  line(-0.05, -0.06, -0.07, -0.32) // stem
  line(0.05, -0.06, 0.07, -0.32)
  poly([
    [-0.3, -0.32],
    [0.3, -0.32],
    [0.34, -0.45],
    [-0.34, -0.45],
    [-0.3, -0.32],
  ])
  star(0, 0.22, 0.12, 8)
  return segs
}

// Minecraft's enchanting-table script (the Standard Galactic Alphabet), glyphs on a 2×3 grid, y up; a dot is a small square
const GALACTIC: Record<string, { lines: number[][][]; dots: number[][] }> = {
  H: { lines: [[[0, 3], [2, 3]], [[0, 2], [2, 2]], [[1, 2], [1, 0]]], dots: [] },
  I: { lines: [[[1, 3], [1, 2.2]], [[1, 1.6], [1, 0]]], dots: [] },
  R: { lines: [], dots: [[0, 3], [2, 3], [0, 0], [2, 0]] },
  E: { lines: [[[0, 3], [0, 0], [2, 0]]], dots: [[2, 2.6]] },
  M: { lines: [[[2, 3], [2, 0], [0, 0]]], dots: [[0, 2.6]] },
}

// "HIRE ME" in the galactic script, one word per row
function hireMe() {
  const { segs, poly } = pen()
  const u = 0.1 // one grid step; a glyph is 2 wide with a 1 step gap, so "HIRE" is 11 steps wide
  const words = ['HIRE', 'ME']
  words.forEach((word, row) => {
    const x0 = -((word.length * 3 - 1) * u) / 2
    const y0 = (row === 0 ? 1.25 : -4.25) * u // rows 3 tall, 2.5 apart
    ;[...word].forEach((ch, i) => {
      const at = ([x, y]: number[]) => [x0 + (i * 3 + x) * u, y0 + y * u]
      for (const pts of GALACTIC[ch].lines) poly(pts.map(at))
      for (const d of GALACTIC[ch].dots) {
        const [x, y] = at(d)
        const r = u * 0.15
        poly([[x - r, y - r], [x + r, y - r], [x + r, y + r], [x - r, y + r], [x - r, y - r]])
      }
    })
  })
  return segs
}

const DRAWINGS = { mellon: doors, lumos: hallows, xp: hireMe, victory: trophy }
export type Drawing = keyof typeof DRAWINGS
export const isDrawing = (name: string): name is Drawing => name in DRAWINGS

// `count` points spread evenly along the drawing's lines, as [x0, y0, x1, y1, …].
export function drawingPoints(name: Drawing, count: number) {
  const segs = DRAWINGS[name]()
  const lengths = segs.map(([x1, y1, x2, y2]) => Math.hypot(x2 - x1, y2 - y1))
  const total = lengths.reduce((a, b) => a + b, 0)
  const out = new Float32Array(count * 2)
  // walk the total length in even steps, so the dots are spread uniformly along every line
  let seg = 0
  let walked = 0
  for (let i = 0; i < count; i++) {
    const d = ((i + 0.5) / count) * total
    while (walked + lengths[seg] < d && seg < segs.length - 1) walked += lengths[seg++]
    const [x1, y1, x2, y2] = segs[seg]
    const t = lengths[seg] ? (d - walked) / lengths[seg] : 0
    out[i * 2] = x1 + (x2 - x1) * t
    out[i * 2 + 1] = y1 + (y2 - y1) * t
  }
  return out
}
