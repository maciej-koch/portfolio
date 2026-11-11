import * as THREE from 'three'

const cache = new Map<string, THREE.CanvasTexture>()

// light text (or `color`) on a transparent canvas, shrunk to fit, cached per label
export function labelTexture(text: string, color = '#ececec') {
  const key = `${text}|${color}`
  const hit = cache.get(key)
  if (hit) return hit
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  let size = 56
  ctx.font = `600 ${size}px system-ui, sans-serif`
  while (ctx.measureText(text).width > 460 && size > 24) ctx.font = `600 ${--size}px system-ui, sans-serif`
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 256, 68)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  cache.set(key, texture)
  return texture
}
