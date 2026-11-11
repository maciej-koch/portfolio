import { existsSync } from 'node:fs'
import type { Metadata } from 'next'
import { cv } from '@/lib/cv'

// Print source for public/cv.pdf (`npm run cv`); reachable but not linked and not indexed.
export const metadata: Metadata = {
  title: `CV · ${cv.name}`,
  robots: { index: false, follow: false },
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-5">
    <h2 className="mb-2 border-b border-neutral-300 pb-1 text-[11px] font-bold tracking-[0.12em] text-neutral-500 uppercase">{title}</h2>
    {children}
  </section>
)

export default function CvPage() {
  const photo = existsSync('public/cv-photo.jpg')
  return (
    <main className="cv mx-auto my-6 grid h-[297mm] w-[210mm] grid-cols-[62mm_1fr] bg-white text-[11pt] leading-[1.5] text-neutral-900 shadow-xl print:my-0 print:shadow-none">
      <aside className="flex flex-col gap-6 bg-neutral-100 px-6 py-8">
        {photo ? (
          <img src="/cv-photo.jpg" alt="" className="aspect-square w-full rounded-sm object-cover" />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center rounded-sm bg-neutral-900 text-[42pt] font-bold tracking-tight text-white">
            MK
          </div>
        )}
        <div>
          <h1 className="text-[20pt] leading-none font-bold">{cv.name}</h1>
          <p className="mt-1 text-[11pt] text-neutral-600">{cv.role}</p>
        </div>
        <Section title="Contact">
          <ul className="space-y-0.5 text-[9.5pt]">
            {cv.contact.map((c) => (
              <li key={c.label}>
                {c.href ? (
                  <a href={c.href} className="text-inherit">
                    {c.label}
                  </a>
                ) : (
                  c.label
                )}
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Skills">
          <ul className="flex flex-wrap gap-1.5 text-[9pt]">
            {cv.skills.map((s) => (
              <li key={s} className="rounded-full border border-neutral-400 px-2 py-0.5">
                {s}
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Languages">
          <ul className="text-[9.5pt]">
            {cv.languages.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </Section>
      </aside>

      <div className="flex flex-col px-8 py-8">
        <Section title="About">
          <p>{cv.about}</p>
        </Section>
        <Section title="Experience">
          {cv.work.map((w) => (
            <article key={w.org} className="mb-3">
              <div className="flex justify-between gap-4">
                <h3 className="font-bold">
                  {w.role} · {w.org}
                </h3>
                <span className="whitespace-nowrap text-neutral-500">{w.period}</span>
              </div>
              <ul className="mt-0.5 list-disc pl-4 text-neutral-700">
                {w.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </Section>
        <Section title="Education">
          {cv.education.map((e) => (
            <article key={e.org} className="mb-2">
              <div className="flex justify-between gap-4">
                <h3 className="font-bold">{e.degree}</h3>
                <span className="whitespace-nowrap text-neutral-500">{e.period}</span>
              </div>
              <p className="text-neutral-700">
                {e.org}
                {e.note ? ` · ${e.note}` : ''}
              </p>
            </article>
          ))}
        </Section>
        <Section title="Projects">
          {cv.projects.map((p) => (
            <article key={p.name} className="mb-2">
              <h3 className="font-bold">
                {p.name} <span className="font-normal text-neutral-500">({p.stack})</span>
              </h3>
              <p className="text-neutral-700">{p.desc}</p>
            </article>
          ))}
        </Section>
        <p className="mt-auto text-[7pt] leading-snug text-neutral-400">{cv.clause}</p>
      </div>
    </main>
  )
}
