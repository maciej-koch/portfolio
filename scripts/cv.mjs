// Renders /cv to public/cv.pdf with Playwright's Chromium. Uses a dev server that is already running
// (`npm run dev`, or CV_URL) and otherwise starts one for the duration of the export.
import { spawn } from 'node:child_process'
import { chromium } from '@playwright/test'

const up = async (url) => {
  try {
    return (await fetch(url)).ok
  } catch {
    return false
  }
}

let url = process.env.CV_URL ?? 'http://localhost:3000/cv'
let server
if (!(await up(url))) {
  url = 'http://localhost:3311/cv'
  server = spawn('node_modules/.bin/next', ['dev', '-p', '3311'], { stdio: ['ignore', 'ignore', 'inherit'], detached: true })
  for (let i = 0; !(await up(url)); i++) {
    if (server.exitCode !== null) throw new Error(`next dev exited with ${server.exitCode}`)
    if (i > 120) throw new Error(`${url} did not come up`)
    await new Promise((r) => setTimeout(r, 1000))
  }
}

try {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.pdf({ path: 'public/cv.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true })
  await browser.close()
  console.log(`wrote public/cv.pdf from ${url}`)
} finally {
  if (server) process.kill(-server.pid)
}
