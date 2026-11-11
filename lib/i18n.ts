import type { Metadata } from 'next'

// English lives at the root, Polish under /pl (same paths otherwise)
export const LANGS = ['en', 'pl'] as const
export type Lang = (typeof LANGS)[number]

export const SITE = 'https://maciej-koch.com'

export const href = (lang: Lang, path = '/') => (lang === 'pl' ? (path === '/' ? '/pl' : `/pl${path}`) : path)

// "5 lat", "22 lata": Polish picks the noun form by the number
export const polishYears = (n: number) =>
  ({ one: 'rok', few: 'lata', many: 'lat' })[new Intl.PluralRules('pl').select(n) as 'one' | 'few' | 'many'] ?? 'lat'

// canonical + hreflang for one page in both languages; each page sets its own, or it would inherit the root's "/"
export function pageMetadata(lang: Lang, path: string, { title, description }: { title: string; description: string }): Metadata {
  const url = `${SITE}${href(lang, path)}`
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: `${SITE}${href('en', path)}`, pl: `${SITE}${href('pl', path)}`, 'x-default': `${SITE}${href('en', path)}` },
    },
    openGraph: { type: 'website', url, title, description, locale: lang === 'pl' ? 'pl_PL' : 'en_US', images: [{ url: '/og.png', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description },
  }
}
