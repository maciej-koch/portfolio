import { content } from '@/lib/content'

export const ids = content.sections.map((s) => s.id)

export const CHARS = '!<>-_\\/[]{}—=+*^?#'
export const HINT = 'type lumos'
export const HINT_TOUCH = 'hold me' // no keyboard on phones: a long press on the name casts lumos
export const SPELL = 'LUMOS'
export const HOLD_DELAY_MS = 250 // a plain click never shows the charge
export const HOLD_MS = 1400 // press this long to cast it
export const SPELL_SHOW_MS = 2500 // how long the cast word stays before the name comes back
export const SCRAMBLE_FRAMES = 24
export const SCRAMBLE_MS = 40

// keep in sync with --animate-toast / --animate-toast-long in globals.css
export const TOAST_MS = 8000
export const TOAST_LONG_MS = 15000 // = SECONDS.victory

// "fan": a pause this long without a click starts the phrase over; the cast follows the last word, which then stays lit
export const TIP_IDLE_MS = 3000
export const TIP_CAST_MS = 400
export const TIP_DONE_MS = 1500

export const XP_LEVEL_UP_MS = 2200 // the bar stays full and the level +1 this long after a click
