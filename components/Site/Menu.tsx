import { content } from '@/lib/content'
import { stopEggs } from '@/lib/eggs'

const link = [
  'relative flex flex-col items-center text-[0.85rem] text-muted transition-colors duration-300',
  'hover:text-text hover:no-underline focus-visible:text-text focus-visible:no-underline aria-[current=page]:text-white',
  // phone: a bar growing above the active tab
  'after:absolute after:-top-[11px] after:h-0.5 after:w-0 after:bg-white after:transition-[width] after:duration-[400ms] after:ease-site aria-[current=page]:after:w-full',
  // desktop: a line between the number and the label, longer on hover and for the active one
  'lg:flex-row lg:gap-3 lg:text-[1.05rem] lg:after:hidden',
  'lg:before:order-1 lg:before:h-px lg:before:w-4 lg:before:bg-current lg:before:transition-[width] lg:before:duration-[400ms] lg:before:ease-site lg:hover:before:w-8 lg:aria-[current=page]:before:w-12',
].join(' ')

export default function Menu({ active }: { active: string }) {
  return (
    <nav
      className="menu wipeable row-start-4 -mx-4 mt-3 -mb-[calc(10px+env(safe-area-inset-bottom))] flex justify-between border-t border-line bg-bg px-4 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] lg:col-start-1 lg:mx-0 lg:mb-0 lg:bg-transparent lg:px-0 lg:pb-0 lg:row-start-2 lg:mt-0 lg:flex-col lg:gap-[0.4rem] lg:self-center lg:border-0 lg:pt-0"
      aria-label="Sections"
    >
      {content.sections.map((s, i) => (
        <a key={s.id} href={`#${s.id}`} className={link} onClick={stopEggs} aria-current={s.id === active ? 'page' : undefined}>
          <span className="font-mono text-[0.7rem] opacity-60">{String(i + 1).padStart(2, '0')}</span>
          <span className="lg:order-2">{s.label}</span>
        </a>
      ))}
    </nav>
  )
}
