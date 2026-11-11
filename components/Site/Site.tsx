'use client'

import { useCallback, useEffect, useState } from 'react'
import { preload } from 'react-dom'
import dynamic from 'next/dynamic'
import { content, copy, isModel } from '@/lib/content'
import type { Lang } from '@/lib/i18n'
import { egg } from '@/lib/eggs'
import Terminal from '@/components/Terminal'
import Brand from './Brand'
import Corner from './Corner'
import Menu from './Menu'
import Sections from './Sections'
import Toast from './Toast'
import { ids } from './constants'
import { titleFor } from './helpers'
import { CopyContext, useActiveSection, useFoundToast, useTypedWords } from './hooks'

// three.js is heavy and touches window/WebGL: client-only, loaded after the text paints
const Scene = dynamic(() => import('@/components/Scene'), { ssr: false })

export default function Site({ lang = 'en' }: { lang?: Lang }) {
  const active = useActiveSection()
  const toast = useFoundToast()
  const [term, setTerm] = useState(false)
  const closeTerm = useCallback(() => setTerm(false), [])
  useTypedWords()
  // the model is the biggest download (~0.5 MB): fetch it alongside the three.js chunk, but only after hydration,
  // so on slow networks it doesn't compete with the page's own scripts (a preload in the HTML pushed mobile LCP to ~4 s)
  useEffect(() => {
    for (const s of content.sections) if (isModel(s.shape)) preload(s.shape, { as: 'fetch', crossOrigin: 'anonymous' })
  }, [])

  return (
    // `contents`: the wrapper only carries the language, the layout is unchanged
    <CopyContext value={copy[lang]}>
      <div lang={lang} className="contents">
      {/* React hoists this into <head>; rendering it here keeps it in sync with the active section */}
      <title>{titleFor(active)}</title>
      {/* lvh, not inset-0: the on-screen keyboard must not resize the canvas and push the model up */}
      <div className="scene fixed inset-x-0 top-0 h-lvh [&_canvas]:cursor-grab [&_canvas]:touch-none" aria-hidden>
        <Scene active={ids.indexOf(active)} />
      </div>

      {/* empty grid cells let drags through to the canvas; the children stay interactive */}
      <div className="layout pointer-events-none relative grid h-svh grid-rows-[auto_1fr_auto_auto] px-4 pt-5 pb-[calc(10px+env(safe-area-inset-bottom))] *:pointer-events-auto lg:grid-cols-[180px_440px_1fr] lg:grid-rows-[auto_1fr_auto] lg:gap-x-12 lg:px-0 lg:pt-12 lg:pb-10 lg:pl-14">
        <Brand />
        <Menu active={active} />
        <Sections active={active} term={term} onTerm={() => setTerm((o) => !o)} />
        <button
          type="button"
          className="egg wipeable fixed top-[22px] right-3.5 h-7 w-7 cursor-pointer rounded-full border border-transparent text-[0.8rem] text-muted opacity-60 transition-[opacity,color] duration-300 hover:text-text hover:opacity-100 focus-visible:text-text focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-text lg:top-[52px] lg:right-[52px] lg:h-6 lg:w-6 lg:text-[0.75rem] lg:opacity-45"
          onClick={() => egg('warp')}
          aria-label="Hyperspace"
        >
          ✦
        </button>
        <Terminal open={term} onClose={closeTerm} />
        {toast && <Toast {...toast} />}
        <Corner />
      </div>
      </div>
    </CopyContext>
  )
}
