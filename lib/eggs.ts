// Easter-egg triggers, decoupled from whoever reacts to them (dust, model, toasts).
// 'warp' is the corner button, 'rm' is the terminal's `sudo rm -rf /`, 'stack' is the Stack model toppling over after
// too many clicks, 'victory' plays once all are found; the rest are drawings the dust forms.
export type Egg = 'warp' | 'rm' | 'stack' | 'mellon' | 'lumos' | 'xp' | 'victory'

// how long the model steps aside / the dust holds a drawing
export const SECONDS: Record<Egg, number> = { warp: 2.5, rm: 10, stack: 3.5, mellon: 4.5, lumos: 4.5, xp: 4.5, victory: 15 }

// words typed anywhere (or run in the terminal) that summon a drawing
export const WORDS = { mellon: 'mellon', lumos: 'lumos' } as const

// what counts towards "found them all" ('xp' is the hidden level in Exp)
export const FOUND = ['warp', 'mellon', 'lumos', 'xp', 'stack', 'rm'] as const
export type Found = (typeof FOUND)[number]
const KEY = 'eggs'

const load = (): Found[] => {
  try {
    const stored: string[] = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    // eggs that no longer exist (the old 'name') don't count
    return stored.filter((n): n is Found => (FOUND as readonly string[]).includes(n))
  } catch {
    return []
  }
}

export const egg = (name: Egg) => {
  window.dispatchEvent(new CustomEvent('egg', { detail: name }))
  if (name !== 'victory') discover(name)
}

export function discover(name: Found) {
  const had = load()
  if (had.includes(name)) return
  const found = [...had, name]
  try {
    localStorage.setItem(KEY, JSON.stringify(found))
  } catch {
    // private mode etc.: progress just won't survive a reload
  }
  window.dispatchEvent(new CustomEvent('found', { detail: found.length }))
  // the finale waits for the effect that was just triggered to finish
  if (found.length === FOUND.length) setTimeout(() => egg('victory'), SECONDS[name] * 1000 + 500)
}

const listen = <T,>(type: string, fn: (detail: T) => void) => {
  const handler = (e: Event) => fn((e as CustomEvent<T>).detail)
  window.addEventListener(type, handler)
  return () => window.removeEventListener(type, handler)
}
export const onEgg = (fn: (name: Egg) => void) => listen<Egg>('egg', fn)
export const onFound = (fn: (count: number) => void) => listen<number>('found', fn)

// ends the effect that is playing (a click on the menu): the dust lets go and the model comes back
export const stopEggs = () => window.dispatchEvent(new Event('egg-stop'))
export const onStopEggs = (fn: () => void) => listen('egg-stop', fn)
