import { describe, expect, it } from 'vitest'
import { copy } from '@/lib/content'
import { href, polishYears } from '@/lib/i18n'
import { studio } from '@/lib/studio'

describe('languages', () => {
  it('puts Polish under /pl and leaves English at the root', () => {
    expect(href('en')).toBe('/')
    expect(href('pl')).toBe('/pl')
    expect(href('en', '/kochandcode')).toBe('/kochandcode')
    expect(href('pl', '/kochandcode')).toBe('/pl/kochandcode')
  })

  it('picks the Polish word for years by the number', () => {
    expect([1, 2, 4, 5, 12, 22, 25].map(polishYears)).toEqual(['rok', 'lata', 'lata', 'lat', 'lat', 'lata', 'lat'])
  })

  it('has the same copy keys in every language', () => {
    expect(Object.keys(copy.pl).sort()).toEqual(Object.keys(copy.en).sort())
    expect(Object.keys(studio.copy.pl).sort()).toEqual(Object.keys(studio.copy.en).sort())
  })

  it('keeps the tooltip word inside the about text, or the mellon egg has nothing to click', () => {
    for (const c of Object.values(copy)) expect(c.about).toContain(c.aboutTip.word)
  })
})
