// Copy for the koch&code company page (app/kochandcode, app/pl/kochandcode). Edit freely.
import { content } from './content'
import type { Lang } from './i18n'

export const studio = {
  email: content.links.find((l) => l.label === 'Email')!.url,
  phone: { label: '+48 883 990 811', url: 'tel:+48883990811' },
  projects: [
    { name: 'Karczma Zamkowa', url: 'https://karczma-zamkowa.pl', note: { en: 'restaurant, Kończyce Małe', pl: 'restauracja, Kończyce Małe' } },
    { name: 'Restauracja Mateo', url: 'https://restauracja-mateo.pl', note: { en: 'restaurant, Zebrzydowice', pl: 'restauracja, Zebrzydowice' } },
    { name: 'Gabinet PAPLA', url: 'https://logopeda-cieszyn.pl/', note: { en: 'speech therapy, Cieszyn', pl: 'gabinet logopedyczny, Cieszyn' } },
  ],
  copy: {
    en: {
      title: 'koch&code · websites and web apps',
      description: 'koch&code, the one-person studio of Maciej Koch: from simple WordPress sites to React and Next.js apps, from the mockup to launch.',
      lead: "Hi, I'm Maciej. I build everything from simple WordPress sites, where you can change the text and photos yourself, to larger React and Next.js apps, server included. I work alone, so from the first chat to launch day you talk directly to me.",
      work: 'Selected work',
      contact: 'Got an idea? Drop me a line or give me a call',
      back: 'Maciej Koch · portfolio',
      other: { label: 'PL', name: 'Polski', url: '/pl/kochandcode' },
    },
    pl: {
      title: 'koch&code · strony i aplikacje internetowe',
      description: 'koch&code, jednoosobowe studio Macieja Kocha: od prostych stron na WordPressie po aplikacje w React i Next, od makiety po wdrożenie.',
      lead: 'Cześć, jestem Maciej. Robię wszystko, od prostych stron na WordPressie, w których łatwo samemu zmienić teksty i zdjęcia, po rozbudowane aplikacje w React i Next, razem z serwerem. Pracuję sam, więc od pierwszej rozmowy do startu projektu rozmawiasz bezpośrednio ze mną.',
      work: 'Wybrane realizacje',
      contact: 'Masz pomysł? Napisz albo zadzwoń',
      back: 'Maciej Koch · portfolio',
      other: { label: 'EN', name: 'English', url: '/kochandcode' },
    },
  } satisfies Record<Lang, unknown>,
}
