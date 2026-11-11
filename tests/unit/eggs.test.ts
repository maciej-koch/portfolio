import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { discover, egg, FOUND, onEgg, onFound, SECONDS, WORDS } from '@/lib/eggs'

describe('easter-egg bookkeeping', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })
  afterEach(() => vi.useRealTimers())

  it('counts each egg once and persists progress', () => {
    const counts: number[] = []
    const off = onFound((n) => counts.push(n))
    discover('warp')
    discover('warp')
    discover('xp')
    off()
    expect(counts).toEqual([1, 2])
    expect(JSON.parse(localStorage.getItem('eggs')!)).toEqual(['warp', 'xp'])
  })

  it('ignores eggs that no longer exist in stored progress', () => {
    localStorage.setItem('eggs', JSON.stringify(['warp', 'name']))
    const counts: number[] = []
    const off = onFound((n) => counts.push(n))
    discover('mellon')
    off()
    expect(counts).toEqual([2])
    expect(JSON.parse(localStorage.getItem('eggs')!)).toEqual(['warp', 'mellon'])
  })

  it('egg() notifies listeners and counts as a discovery, except the finale itself', () => {
    const eggs: string[] = []
    const off = onEgg((n) => eggs.push(n))
    egg('mellon')
    egg('victory')
    off()
    expect(eggs).toEqual(['mellon', 'victory'])
    expect(JSON.parse(localStorage.getItem('eggs')!)).toEqual(['mellon'])
  })

  it('plays the finale once the last egg is found, after that egg finishes', () => {
    const eggs: string[] = []
    const off = onEgg((n) => eggs.push(n))
    for (const name of FOUND) discover(name)
    expect(eggs).not.toContain('victory')
    vi.advanceTimersByTime(SECONDS.rm * 1000 + 600) // 'rm' is the last in FOUND
    off()
    expect(eggs).toEqual(['victory'])
  })

  it('does not play the finale twice', () => {
    for (const name of FOUND) discover(name)
    vi.runAllTimers()
    const eggs: string[] = []
    const off = onEgg((n) => eggs.push(n))
    discover('warp')
    vi.runAllTimers()
    off()
    expect(eggs).toEqual([])
  })

  it('every typed word maps to a drawing that the finder counts', () => {
    for (const name of Object.values(WORDS)) expect(FOUND).toContain(name)
  })
})
