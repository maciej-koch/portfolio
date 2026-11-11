import { useRef } from 'react'
import { content } from '@/lib/content'
import { egg } from '@/lib/eggs'
import { HOLD_DELAY_MS, HOLD_MS, ids, SPELL_SHOW_MS } from './constants'
import { useScramble } from './hooks'

// a click on the name scrambles it; pressing and holding anywhere on the header (name, role and a margin around them)
// charges LUMOS in place of the name and casts it
export default function Brand() {
  const [name, scramble, charge, reset] = useScramble(content.name)
  const hold = useRef({ frame: 0, charging: false, cast: false })

  const press = () => {
    const h = hold.current
    const start = performance.now()
    Object.assign(h, { charging: false, cast: false })
    const tick = () => {
      const t = performance.now() - start
      if (t >= HOLD_MS) {
        h.cast = true
        h.charging = false
        egg('lumos')
        charge(1) // the spell stays spelled out for a moment, then the name comes back
        setTimeout(scramble, SPELL_SHOW_MS)
        return
      }
      if (t >= HOLD_DELAY_MS) {
        h.charging = true
        charge((t - HOLD_DELAY_MS) / (HOLD_MS - HOLD_DELAY_MS))
      }
      h.frame = requestAnimationFrame(tick)
    }
    h.frame = requestAnimationFrame(tick)
  }
  // let go (or slid off) before the spell was cast
  const release = () => {
    const h = hold.current
    cancelAnimationFrame(h.frame)
    if (h.charging) reset()
    h.charging = false
  }

  return (
    // the ::before widens the press area past the text without changing the header's box,
    // which lib/layout measures to place the model on phones; isolate keeps it under the text but over the canvas
    <header
      className="brand wipeable relative isolate select-none [-webkit-touch-callout:none] before:absolute before:-inset-x-4 before:-inset-y-3 before:-z-10 before:content-[''] lg:col-span-2"
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onContextMenu={(e) => e.preventDefault()} // no long-press menu on phones
    >
      <h1 className="text-[1.4rem] leading-tight font-bold lg:text-[1.6rem]">
        <a
          href={`#${ids[0]}`}
          className="text-text hover:no-underline focus-visible:no-underline"
          onClick={(e) => {
            // the click that ends a hold is not a click on the name
            if (hold.current.cast) {
              e.preventDefault()
              hold.current.cast = false
              return
            }
            scramble()
          }}
        >
          {name}
        </a>
      </h1>
      <p className="text-muted">{content.role}</p>
    </header>
  )
}
