'use client'

import dynamic from 'next/dynamic'

// three.js touches window/WebGL: client-only, loaded after the text paints
const Scene = dynamic(() => import('./Scene'), { ssr: false })

export default function Background() {
  return (
    <div className="fixed inset-x-0 top-0 -z-10 h-lvh" aria-hidden>
      <Scene />
    </div>
  )
}
