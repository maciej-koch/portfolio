import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { copy } from '@/lib/content'
import { egg, FOUND, onFound, onStopEggs, WORDS } from '@/lib/eggs'
import { prefersReducedMotion } from '@/lib/motion'
import { CHARS, HINT, HINT_TOUCH, ids, SPELL, SCRAMBLE_FRAMES, SCRAMBLE_MS, TOAST_LONG_MS, TOAST_MS } from './constants'
import { fromHash } from './helpers'
import type { Toast } from './types'

// the page's copy in its language (provided by Site)
export const CopyContext = createContext(copy.en)
export const useCopy = () => useContext(CopyContext)

// the section from the URL hash
export function useActiveSection() {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const sync = () => setActive(fromHash())
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  return active
}

const glyph = () => CHARS[Math.floor(Math.random() * CHARS.length)]

// letters flicker through random glyphs (with the hint showing for a moment) and settle left to right
export function useScramble(text: string) {
  const [shown, setShown] = useState(text)
  const run = useCallback(() => {
    let frame = 0
    const hint = matchMedia('(pointer: coarse)').matches ? HINT_TOUCH : HINT
    const at = Math.max(0, Math.floor((text.length - hint.length) / 2))
    const id = setInterval(() => {
      const done = Math.floor((Math.max(0, ++frame - 8) / (SCRAMBLE_FRAMES - 8)) * text.length)
      const chars = [...text].map((ch, i) => (i < done || ch === ' ' ? ch : glyph()))
      if (frame >= 2 && frame <= 8) [...hint].forEach((ch, j) => at + j < chars.length && (chars[at + j] = ch))
      setShown(chars.join(''))
      if (done >= text.length) clearInterval(id)
    }, SCRAMBLE_MS)
    return () => clearInterval(id)
  }, [text])
  useEffect(() => (prefersReducedMotion() ? undefined : run()), [run])
  // the spell being charged, p from 0 to 1: its letters lock in left to right, the rest still flicker
  const charge = useCallback((p: number) => {
    const done = Math.floor(p * SPELL.length)
    setShown([...SPELL].map((ch, i) => (i < done ? ch : glyph())).join(''))
  }, [])
  const reset = useCallback(() => setShown(text), [text])
  return [shown, run, charge, reset] as const
}

// words typed anywhere on the page summon their easter egg (the terminal handles its own input)
export function useTypedWords() {
  useEffect(() => {
    let typed = ''
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      typed = (typed + e.key).slice(-8).toLowerCase()
      for (const [word, name] of Object.entries(WORDS)) if (typed.endsWith(word)) egg(name)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

// "easter egg n/6" after each discovery; the finale stays as long as its drawing and glows; a menu click hides it
export function useFoundToast() {
  const [toast, setToast] = useState<Toast | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(
    () =>
      onFound((n) => {
        const all = n === FOUND.length
        setToast({ text: all ? `${n}/${FOUND.length} · you found them all` : `easter egg ${n}/${FOUND.length}`, final: all })
        clearTimeout(timer.current) // a quick next discovery must not be cut short by the previous toast's timer
        timer.current = setTimeout(() => setToast(null), all ? TOAST_LONG_MS : TOAST_MS)
      }),
    [],
  )
  useEffect(
    () =>
      onStopEggs(() => {
        clearTimeout(timer.current)
        setToast(null)
      }),
    [],
  )
  return toast
}
