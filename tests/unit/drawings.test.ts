import { describe, expect, it } from 'vitest'
import { drawingPoints, type Drawing } from '@/lib/drawings'

const NAMES: Drawing[] = ['mellon', 'lumos', 'xp', 'victory']

describe('drawingPoints', () => {
  it.each(NAMES)('%s gives exactly `count` finite points', (name) => {
    const pts = drawingPoints(name, 500)
    expect(pts).toHaveLength(1000)
    expect(Array.from(pts).every(Number.isFinite)).toBe(true)
  })

  it.each(NAMES)('%s stays inside the drawing box (about 1 unit wide, at most 1.35 tall)', (name) => {
    const pts = drawingPoints(name, 800)
    for (let i = 0; i < pts.length; i += 2) {
      expect(Math.abs(pts[i])).toBeLessThanOrEqual(0.7)
      expect(Math.abs(pts[i + 1])).toBeLessThanOrEqual(0.7)
    }
  })

  it.each(NAMES)('%s spreads points over the whole drawing, not one corner', (name) => {
    const pts = drawingPoints(name, 800)
    const xs = Array.from(pts).filter((_, i) => i % 2 === 0)
    const ys = Array.from(pts).filter((_, i) => i % 2 === 1)
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(0.8)
    expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(0.8)
  })
})
