import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // the stylesheet is ~6 kB: inlining it removes a render-blocking request before first paint
  experimental: { inlineCss: true },
}

export default nextConfig
