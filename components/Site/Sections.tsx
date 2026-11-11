import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { content, type Copy } from '@/lib/content'
import { egg } from '@/lib/eggs'
import { ids, TIP_CAST_MS, TIP_DONE_MS, TIP_IDLE_MS } from './constants'
import { useCopy } from './hooks'
import Xp from './Xp'

// other sites open in a new tab, this site's own pages (a leading "/") in the same one
const External = ({ href, children }: { href: string; children: ReactNode }) =>
  !href ? (
    <>{children}</>
  ) : href.startsWith('/') ? (
    <a href={href}>{children}</a>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )

// the first `word` of `text` as an external link
function Linked({ text, word, url }: { text: string; word: string; url: string }) {
  const i = text.indexOf(word)
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <External href={url}>{word}</External>
      {text.slice(i + word.length)}
    </>
  )
}

// the first `word` of `text` as a button with a tooltip (open on hover and focus/tap). Every click lights the next word of
// the tooltip in gold; once the whole phrase is lit, the Doors of Durin open. A pause without clicks starts over.
function Tip({ text, word, tip }: { text: string; word: string; tip: string }) {
  const words = tip.split(' ')
  const [lit, setLit] = useState(0)
  // the count lives in a ref too, so clicks faster than a re-render still each count once
  const count = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  const i = text.indexOf(word)
  if (i < 0) return text

  const show = (n: number) => setLit((count.current = n))
  const click = () => {
    if (count.current === words.length) return // already opening
    show(count.current + 1)
    clearTimeout(timer.current)
    if (count.current < words.length) {
      timer.current = setTimeout(() => show(0), TIP_IDLE_MS)
      return
    }
    // let the last word show gold for a moment, cast, then keep the lit phrase up a little longer
    timer.current = setTimeout(() => {
      egg('mellon')
      timer.current = setTimeout(() => show(0), TIP_DONE_MS)
    }, TIP_CAST_MS)
  }

  return (
    <>
      {text.slice(0, i)}
      <button
        type="button"
        onClick={click}
        className="tip group/tip relative cursor-pointer underline decoration-dotted underline-offset-[3px] outline-none"
      >
        {word}
        <span
          role="tooltip"
          data-open={lit > 0 || undefined}
          className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 rounded-md border border-line bg-[#1a1a1a] px-[0.6rem] py-[0.3rem] text-[0.8rem] whitespace-nowrap text-text no-underline opacity-0 transition-opacity group-hover/tip:opacity-100 group-focus/tip:opacity-100 data-open:opacity-100"
        >
          {words.map((w, j) => (
            <span key={j} className={`transition-colors duration-300 ${j < lit ? 'text-gold' : ''}`}>
              {j > 0 && ' '}
              {w}
            </span>
          ))}
        </span>
      </button>
      {text.slice(i + word.length)}
    </>
  )
}

const Rows = ({ name, list }: { name: string; list: Copy['work'] }) => (
  <>
    <h3 className="sub mt-4 mb-[0.2rem] text-[0.8rem] font-bold tracking-[0.08em] text-muted uppercase">{name}</h3>
    <ul className="rows">
      {list.map((r) => (
        <li key={r.org} className="flex justify-between gap-4 border-t border-line py-[0.35rem]">
          <span>
            {r.role} @ <External href={r.url}>{r.org}</External>
          </span>
          <span className="text-muted whitespace-nowrap">{r.period}</span>
        </li>
      ))}
    </ul>
  </>
)

const headingText = "text-[1.8rem] font-bold after:text-white after:content-['.']"
const heading = `mb-3 ${headingText}`

type Props = { active: string; term: boolean; onTerm: () => void }

// every section stays in the HTML for crawlers; only the active one is shown
export default function Sections({ active, term, onTerm }: Props) {
  const c = useCopy()
  // the heading stays put, only the body scrolls (the panel is capped at 40svh on phones)
  const section = (id: string, title: ReactNode, children: ReactNode) => (
    <section
      id={id}
      hidden={id !== active}
      className="flex min-h-0 animate-enter flex-col motion-reduce:animate-none"
      aria-labelledby={`${id}-title`}
    >
      {title}
      <div className="min-h-0 overflow-y-auto [scrollbar-width:none]">{children}</div>
    </section>
  )
  return (
    <main className="panel wipeable row-start-2 flex max-h-[40svh] flex-col self-end overflow-hidden lg:col-start-2 lg:row-start-2 lg:max-h-[70svh] lg:self-center">
      {section(
        ids[0],
        <h2 id={`${ids[0]}-title`} className="sr-only">
          {content.sections[0].label}
        </h2>,
        <>
          <p className="my-1 text-[1.2rem] leading-[1.45] lg:text-[1.3rem]">
            <Linked text={c.intro} {...c.introLink} />
          </p>
          <p className="my-1 text-muted">
            <Tip text={c.about} {...c.aboutTip} />
          </p>
        </>,
      )}
      {section(
        ids[1],
        // hovering the heading row reveals the hidden XP bar
        <div className="group mb-3 flex items-center gap-4">
          <h2 id={`${ids[1]}-title`} className={headingText}>
            {content.sections[1].label}
          </h2>
          <Xp />
        </div>,
        <>
          <Rows name={c.workTitle} list={c.work} />
          <Rows name={c.educationTitle} list={c.education} />
        </>,
      )}
      {section(
        ids[2],
        <h2 id={`${ids[2]}-title`} className={heading}>
          {content.sections[2].label}
        </h2>,
        <ul className="chips flex flex-wrap gap-2">
          {content.stack.map((s, i) => (
            <Fragment key={s}>
              {/* the terminal hides in plain sight among the tools */}
              {i === content.stack.length - 2 && (
                <li className="chip-btn rounded-full border border-line">
                  <button
                    type="button"
                    className="block cursor-pointer rounded-full px-[0.7rem] py-1 font-mono text-[0.85rem] focus-visible:outline-1 focus-visible:outline-text"
                    onClick={onTerm}
                    aria-label="Terminal"
                    aria-expanded={term}
                  >
                    {'>_'}
                  </button>
                </li>
              )}
              <li className="rounded-full border border-line px-[0.7rem] py-1 text-[0.9rem]">{s}</li>
            </Fragment>
          ))}
        </ul>,
      )}
    </main>
  )
}
