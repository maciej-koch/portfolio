import { content, isModel } from '@/lib/content'

export const SHAPES = content.sections.map((s) => s.shape)
export const MODEL_URLS = SHAPES.filter(isModel)

export const FADE_SECONDS = 0.5
export const DRAG = 0.01 // radians per dragged pixel
export const SWAY = { speed: 0.5, angle: 0.5 }
// lit faces read as dark grey; the emissive keeps the unlit back from vanishing into the page, the edges outline it
export const BLOCK = { color: '#2a2a2a', emissive: '#151515', edge: '#ffffff', edgeOpacity: 0.3 }
// overflow: blocks a burst of taps can add before the tower topples; sway: how far it leans when full
export const STACK = { names: ['React', 'Next.js', 'Node.js', 'Express', 'SQL', 'TypeScript'], period: 1.6, height: 0.5, gap: 0.1, overflow: 8, sway: 0.12 }
// the Exp bottle in voxels: glass half-width per row from the bottom, liquid level, the cork column, the "XP" bitmap
// on the front of the liquid (row 0 = top, column 0 = voxel `left`, drawn on the liquid layer at z = `front`)
export const BOTTLE = {
  rows: [4, 5, 6, 6, 6, 6, 6, 6, 5, 4, 3, 2, 2, 2, 3, 3],
  fill: 8,
  cork: { from: 14, to: 18, half: 1.5 },
  mark: { rows: ['#.#.##.', '#.#.#.#', '.#..##.', '#.#.#..', '#.#.#..'], top: 7, left: -3, front: 4 },
  colors: {
    glass: ['#d4ecff'],
    liquid: ['#84e03c', '#92ea4a', '#78d434'],
    mark: '#2d6b12',
    glow: '#4fc800',
    cork: ['#8b5a2b', '#7a4d24'],
    orb: ['#a6ff4f', '#fff36b'],
  },
  orbs: 45,
  neckOrbs: 6,
  speed: 2, // voxels per second
}
