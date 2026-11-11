'use client'

import dynamic from 'next/dynamic'

// three.js touches window/WebGL: client-only, like the main page's scene
const Scene = dynamic(() => import('./Scene'), { ssr: false })

export default function NotFound() {
  return (
    <>
      <title>404 · Maciej Koch</title>
      <h1 className="sr-only">Page not found</h1>
      <div className="fixed inset-0" aria-hidden>
        <Scene />
      </div>
    </>
  )
}
