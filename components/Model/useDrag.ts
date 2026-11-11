import { useCallback, useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { DRAG } from './constants'
import type { Spin } from './types'

// drag (mouse or finger) turns the model; release keeps it coasting.
// Returns a per-frame function that advances the coast and gives the current angle.
export function useDrag() {
  const { gl } = useThree()
  const spin = useRef<Spin>({ angle: 0, vel: 0, dragging: false, lastX: 0, lastT: 0 })

  useEffect(() => {
    const el = gl.domElement
    const s = spin.current
    const down = (e: PointerEvent) => {
      s.dragging = true
      s.vel = 0
      s.lastX = e.clientX
      s.lastT = e.timeStamp
      el.setPointerCapture(e.pointerId)
      el.style.cursor = 'grabbing'
    }
    const move = (e: PointerEvent) => {
      if (!s.dragging) return
      const da = (e.clientX - s.lastX) * DRAG
      const dt = Math.max(e.timeStamp - s.lastT, 8) / 1000
      s.angle += da
      s.vel = THREE.MathUtils.clamp(da / dt, -15, 15)
      s.lastX = e.clientX
      s.lastT = e.timeStamp
    }
    const up = () => {
      s.dragging = false
      el.style.cursor = ''
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [gl])

  return useCallback((delta: number) => {
    const s = spin.current
    if (!s.dragging) {
      s.angle += s.vel * delta
      s.vel *= Math.exp(-2 * delta)
    }
    return s.angle
  }, [])
}
