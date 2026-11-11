import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { drawingPoints, isDrawing } from '@/lib/drawings'
import { onEgg, onStopEggs, SECONDS } from '@/lib/eggs'
import { placementWorld } from '@/lib/layout'
import { prefersReducedMotion } from '@/lib/motion'
import { COUNT, CRASH, GLOW, SIZE, WARP_SPEED } from './constants'
import { dust } from './dust'
import { fragmentShader, streakFragmentShader, streakVertexShader, vertexShader } from './shaders'

// Faint white dust behind the model; 'warp' rushes it past the camera, 'rm' makes it crash and fall, a drawing gathers
// it into glowing line art.
export default function Particles() {
  const { viewport, size, camera } = useThree()
  const reduced = prefersReducedMotion()
  const count = size.width < 768 ? COUNT.phone : COUNT.desktop
  const geometry = useMemo(
    () => dust(count, viewport.width, viewport.height, camera.position.z),
    [count, viewport.width, viewport.height, camera.position.z],
  )
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: SIZE * window.devicePixelRatio },
      uWarp: { value: 0 },
      uTravel: { value: 0 },
      uCrash: { value: 0 },
      uFall: { value: 0 },
      uMorph: { value: 0 },
      uTint: { value: new THREE.Color('#ffffff') },
      uBoost: { value: 1 },
    }),
    [],
  )
  // R3F copies the uniforms prop into each material, so mutate the materials' own copies
  const dots = useRef<THREE.ShaderMaterial>(null!)
  const streaks = useRef<THREE.ShaderMaterial>(null!)
  const until = useRef({ warp: 0, crash: 0, drawing: 0 })
  const anim = useRef({ time: 0, warp: 0, travel: 0, crash: 0, fall: 0, drawing: 0 })
  const glow = useRef(GLOW.mellon)

  useEffect(
    () =>
      onEgg((name) => {
        if (name === 'warp' || name === 'rm') {
          until.current[name === 'warp' ? 'warp' : 'crash'] = performance.now() + SECONDS[name] * 1000
          return
        }
        if (!isDrawing(name)) return
        until.current.drawing = performance.now() + SECONDS[name] * 1000
        glow.current = GLOW[name]
        // lay the drawing over the avatar's spot, as tall as it (drawings span up to 1.35 units)
        const { x, y, diameter, freeWidth } = placementWorld(size, viewport)
        const k = Math.min(diameter * 1.2, freeWidth * 0.95) / 1.35
        const pts = drawingPoints(name, count)
        const target = geometry.dots.getAttribute('aTarget') as THREE.BufferAttribute
        for (let i = 0; i < count; i++) target.setXYZ(i, x + pts[i * 2] * k, y + pts[i * 2 + 1] * k, 0)
        target.needsUpdate = true
      }),
    [count, geometry, size, viewport],
  )

  useEffect(() => onStopEggs(() => (until.current = { warp: 0, crash: 0, drawing: 0 })), [])

  useFrame((_, delta) => {
    const a = anim.current
    if (!reduced) a.time += delta
    const now = performance.now()
    const ease = 1 - Math.exp(-4 * delta)
    a.warp += ((now < until.current.warp ? 1 : 0) - a.warp) * ease
    a.travel += delta * WARP_SPEED * a.warp
    a.drawing += ((now < until.current.drawing ? 1 : 0) - a.drawing) * (1 - Math.exp(-2.5 * delta))
    const crashing = now < until.current.crash
    a.crash += ((crashing ? 1 : 0) - a.crash) * (1 - Math.exp(-(crashing ? 6 : 2) * delta))
    if (crashing && !reduced) a.fall += delta
    else if (a.crash < 0.01) a.fall = 0 // rewound: the next crash falls from the top again
    for (const m of [dots.current, streaks.current]) {
      const u = m.uniforms
      u.uTime.value = a.time
      u.uWarp.value = a.warp
      u.uTravel.value = a.travel
      u.uMorph.value = a.drawing
      u.uCrash.value = a.crash
      u.uFall.value = a.fall
      u.uTint.value.setRGB(1, 1, 1).lerp(glow.current, a.drawing).lerp(CRASH, a.crash)
      u.uBoost.value = 1 + a.drawing
    }
  })

  const common = { uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }
  return (
    <>
      <points geometry={geometry.dots} frustumCulled={false}>
        <shaderMaterial ref={dots} vertexShader={vertexShader} fragmentShader={fragmentShader} {...common} />
      </points>
      <lineSegments geometry={geometry.streaks} frustumCulled={false}>
        <shaderMaterial ref={streaks} vertexShader={streakVertexShader} fragmentShader={streakFragmentShader} {...common} />
      </lineSegments>
    </>
  )
}
