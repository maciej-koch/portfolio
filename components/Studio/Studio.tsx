import { href, type Lang } from '@/lib/i18n'
import { studio } from '@/lib/studio'
import Background from './Background'

// The koch&code company page: logo, what the studio does, the sites built so far, contact. Rendered on the server, so
// all of it is in the HTML; only the dust behind it is client-side.
export default function Studio({ lang }: { lang: Lang }) {
  const c = studio.copy[lang]
  return (
    <div lang={lang} className="studio relative isolate mx-auto flex min-h-svh max-w-[560px] flex-col px-4 pt-16 pb-10 lg:pt-24">
      <Background />
      <h1>
        <img src="/kochandcode.png" alt="koch&code" width={1500} height={300} className="h-auto w-[min(320px,80vw)]" />
      </h1>
      <p className="mt-8 text-[1.15rem] leading-[1.5] lg:text-[1.25rem]">{c.lead}</p>

      <h2 className="mt-10 mb-[0.2rem] text-[0.8rem] font-bold tracking-[0.08em] text-muted uppercase">{c.work}</h2>
      <ul>
        {studio.projects.map((p) => (
          <li key={p.name} className="flex justify-between gap-4 border-t border-line py-[0.35rem]">
            {p.url ? (
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                {p.name}
              </a>
            ) : (
              <span>{p.name}</span>
            )}
            <span className="text-right text-muted">{p.note[lang]}</span>
          </li>
        ))}
      </ul>

      <p className="mt-10">
        {c.contact}:
      </p>
      <p className="mt-1 flex flex-wrap gap-x-6 gap-y-1">
        <a href={studio.email}>{studio.email.replace('mailto:', '')}</a>
        <a href={studio.phone.url} className="whitespace-nowrap">
          {studio.phone.label}
        </a>
      </p>

      <footer className="mt-auto flex items-center justify-between gap-4 pt-12 text-[0.85rem] text-muted">
        <a href={href(lang)} className="text-muted hover:text-text">
          {c.back}
        </a>
        <a href={c.other.url} hrefLang={c.other.label.toLowerCase()} lang={c.other.label.toLowerCase()} className="font-mono text-base text-muted hover:text-text" title={c.other.name}>
          {c.other.label}
        </a>
      </footer>
    </div>
  )
}
