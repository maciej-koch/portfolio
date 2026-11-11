import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import * as THREE from 'three'
import { onEgg, onStopEggs, SECONDS } from '@/lib/eggs'
import { placementWorld, RADIUS } from '@/lib/layout'
import { prefersReducedMotion } from '@/lib/motion'
import { isModel } from '@/lib/content'
import { isDrawing } from '@/lib/drawings'
import { FADE_SECONDS, MODEL_URLS, SHAPES, SWAY } from './constants'
import { fit, materialsOf } from './helpers'
import { shape } from './shapes'
import { useDrag } from './useDrag'
import type { Placement } from './types'

// One mesh per section (a glTF model or a procedural shape); the active one is faded in, the rest out.
export default function Model({ active }: { active: number }) {
  const { viewport, size } = useThree()
  const reduced = prefersReducedMotion()
  // models are meshopt-compressed (see README), so the loader needs the decoder
  const gltfs = useLoader(GLTFLoader, MODEL_URLS, (loader) => loader.setMeshoptDecoder(MeshoptDecoder))
  const objects = useMemo(
    () => SHAPES.map((s) => fit(isModel(s) ? { object: gltfs[MODEL_URLS.indexOf(s)].scene } : shape(s))),
    [gltfs],
  )
  const materials = useMemo(() => objects.map((f) => materialsOf(f.object)), [objects])
  const opacity = useRef<number[]>(SHAPES.map((_, i) => (i === active ? 1 : 0)))
  const group = useRef<THREE.Group>(null!)
  const time = useRef(0)
  const placed = useRef('')
  const target = useRef<Placement>({ x: 0, y: 0, s: 1 })
  const hiddenUntil = useRef(0)
  const spinAngle = useDrag()

  // the model steps aside while the dust draws an easter egg (see Particles)
  useEffect(
    () =>
      onEgg((name) => {
        if (isDrawing(name) || name === 'rm') hiddenUntil.current = performance.now() + SECONDS[name] * 1000
      }),
    [],
  )
  useEffect(() => onStopEggs(() => (hiddenUntil.current = 0)), [])

  useFrame((_, delta) => {
    const step = reduced ? 1 : delta / FADE_SECONDS
    const hidden = performance.now() < hiddenUntil.current
    objects.forEach((f, i) => {
      const prev = opacity.current[i]
      const a = (opacity.current[i] = prev + THREE.MathUtils.clamp((i === active && !hidden ? 1 : 0) - prev, -step, step))
      for (const m of materials[i]) m.opacity = a * m.userData.opacity
      f.object.visible = a > 0
      if (a > 0) f.animate?.(time.current, reduced ? 0 : delta)
    })

    const g = group.current
    const key = `${active}:${size.width}x${size.height}`
    if (placed.current !== key) {
      // measured once per section/size change; the DOM is already updated by the time the frame runs
      const { x, y, diameter } = placementWorld(size, viewport)
      target.current = { x, y, s: diameter / (RADIUS * 2) }
      if (!placed.current) {
        g.position.set(x, y, 0)
        g.scale.setScalar(target.current.s)
      }
      placed.current = key
    }
    // ease towards the new placement so the crossfading meshes don't jump
    const { x, y, s } = target.current
    const t = reduced ? 1 : 1 - Math.exp(-8 * delta)
    g.position.x += (x - g.position.x) * t
    g.position.y += (y - g.position.y) * t
    g.scale.setScalar(g.scale.x + (s - g.scale.x) * t)

    // sway instead of spinning, so a face keeps looking at the viewer; plus whatever the user spun
    if (!reduced) time.current += delta
    g.rotation.y = Math.sin(time.current * SWAY.speed) * SWAY.angle + spinAngle(delta)
  })

  return (
    <group ref={group}>
      {objects.map((f, i) => (
        <group
          key={i}
          position={f.position}
          scale={f.scale}
          // a tap, not the end of a drag (delta: px moved since pointerdown); stopPropagation, or every mesh the ray hits
          // (block, label, edges) counts it again
          onClick={
            f.poke && i === active
              ? (e) => {
                  e.stopPropagation()
                  if (e.delta < 6) f.poke!()
                }
              : undefined
          }
        >
          <primitive object={f.object} />
        </group>
      ))}
    </group>
  )
}
