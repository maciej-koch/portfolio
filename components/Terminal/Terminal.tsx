import { useEffect, useRef, useState, type FormEvent } from 'react'
import { execute } from './commands'
import { PROMPT } from './constants'

type Props = { open: boolean; onClose: () => void }

// A toy shell: a few commands, one file of hints, and one command you were told not to run.
export default function Terminal({ open, onClose }: Props) {
  const [lines, setLines] = useState(PROMPT)
  const [cmd, setCmd] = useState('')
  const out = useRef<HTMLDivElement>(null)

  useEffect(() => {
    out.current?.scrollTo(0, out.current.scrollHeight)
  }, [lines])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const input = cmd.trim()
    setCmd('')
    if (!input) return
    const print = (...more: string[]) => setLines((l) => [...l, ...more])
    print(`$ ${input}`)
    execute(input, { print, clear: () => setLines([]), close: onClose })
  }

  if (!open) return null
  return (
    <div
      className="term fixed right-4 bottom-24 z-[2] flex max-h-[30svh] w-[min(440px,calc(100vw-32px))] flex-col gap-1 rounded-lg border border-line bg-bg/95 px-3 py-2.5 font-mono text-[0.85rem] leading-normal text-text lg:right-auto lg:bottom-10 lg:max-h-[45svh] lg:left-1/2 lg:-translate-x-1/2"
      role="dialog"
      aria-label="Terminal"
    >
      <button
        type="button"
        className="absolute top-1.5 right-2 flex h-6 w-6 cursor-pointer items-center justify-center text-muted transition-colors hover:text-text focus-visible:text-text focus-visible:outline-1 focus-visible:outline-text"
        onClick={onClose}
        aria-label="Close terminal"
      >
        ✕
      </button>
      <div className="term-out min-h-[3lh] flex-1 pr-6 overflow-y-auto break-words whitespace-pre-wrap" ref={out}>
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      {/* the prompt shares the input's size and baseline, or "$" sits too high next to the 16px input */}
      <form className="flex items-baseline gap-[1ch] text-base" onSubmit={submit}>
        <span aria-hidden>$</span>
        {/* 16px (text-base): iOS zooms into any focused input smaller than that */}
        <input
          className="min-w-0 flex-1 bg-transparent text-base outline-none"
          autoFocus
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          // iOS scrolls the page to show the input and leaves it scrolled once the keyboard closes
          onBlur={() => window.scrollTo(0, 0)}
          aria-label="Command"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
        {/* touch keyboards hide their Enter key behind odd labels; preventDefault keeps the input focused */}
        {cmd && (
          <button
            type="submit"
            className="cursor-pointer px-1 text-muted hover:text-text pointer-fine:hidden"
            onPointerDown={(e) => e.preventDefault()}
            aria-label="Run"
          >
            ↵
          </button>
        )}
      </form>
    </div>
  )
}
