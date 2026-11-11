import { useEffect, useState, useSyncExternalStore } from 'react'
import { content } from '@/lib/content'
import { egg } from '@/lib/eggs'
import { XP_LEVEL_UP_MS } from './constants'

// how far into the current year we are, in whole days: the bar fills towards next year's level
function yearProgress() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1).getTime()
  const end = new Date(now.getFullYear() + 1, 0, 1).getTime()
  const days = (end - start) / 864e5
  return Math.floor((now.getTime() - start) / 864e5) / days
}
const noSubscribe = () => () => {}

// A Minecraft experience bar hidden in the Exp heading; its level is the years of experience. Hover reveals it on
// desktop, on phones it flashes now and then; a click levels up and the dust writes "HIRE ME" in the enchanting-table script.
export default function Xp() {
  // 0 in the prerendered HTML, today's value on the client, so hydration matches and the bar fills in
  const fill = useSyncExternalStore(noSubscribe, yearProgress, () => 0)
  const [up, setUp] = useState(false)
  useEffect(() => {
    if (!up) return
    const id = setTimeout(() => setUp(false), XP_LEVEL_UP_MS)
    return () => clearTimeout(id)
  }, [up])

  return (
    <button
      type="button"
      aria-label="Experience level"
      data-up={up || undefined}
      onClick={() => {
        egg('xp')
        setUp(true)
      }}
      className="ml-auto flex w-[180px] max-w-[45%] cursor-pointer flex-col items-center gap-1 opacity-0 transition-opacity duration-500 group-hover:opacity-100 focus-visible:opacity-100 pointer-coarse:animate-xp-flash motion-reduce:pointer-coarse:animate-none motion-reduce:pointer-coarse:opacity-20 data-up:animate-none data-up:opacity-100"
    >
      <span
        className={`font-mono text-[1.1rem] leading-none font-bold text-xp [text-shadow:2px_2px_0_#1a3a05] transition-transform duration-300 ${up ? 'scale-125' : ''}`}
      >
        {content.years + (up ? 1 : 0)}
      </span>
      <span className="block h-[6px] w-full border border-black bg-[#1c1c1c]">
        <span className="block h-full bg-xp transition-[width] duration-700" style={{ width: `${(up ? 1 : fill) * 100}%` }} />
      </span>
    </button>
  )
}
