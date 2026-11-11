import { useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { prefersReducedMotion } from '@/lib/motion'

// "404" in voxels, one bitmap row per line (row 0 = top), same blocky look as the Exp bottle
const GLYPHS: Record<string, string[]> = {
  '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  '0': ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
}
const TEXT = '404'
const GAP = 1 // empty columns between digits
const WIDTH = TEXT.length * 5 + (TEXT.length - 1) * GAP
const HEIGHT = 7
const CELLS = [...TEXT].flatMap((ch, d) =>
  GLYPHS[ch].flatMap((row, y) =>
    [...row].flatMap((c, x) => (c === '#' ? [[d * (5 + GAP) + x - (WIDTH - 1) / 2, (HEIGHT - 1) / 2 - y]] : [])),
  ),
)

export default function Digits() {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const group = useRef<THREE.Group>(null!)
  const { viewport } = useThree()
  const reduced = prefersReducedMotion()
  const scale = Math.min((viewport.width * 0.7) / WIDTH, (viewport.height * 0.45) / HEIGHT)

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    CELLS.forEach(([x, y], i) => mesh.current.setMatrixAt(i, m.makeTranslation(x, y, 0)))
    mesh.current.instanceMatrix.needsUpdate = true
  }, [])

  useFrame(({ clock }) => {
    if (reduced) return
    const t = clock.elapsedTime
    group.current.rotation.y = Math.sin(t * 0.5) * 0.35
    group.current.position.y = Math.sin(t * 0.8) * 0.08
  })

  return (
    <group ref={group} scale={scale}>
      <instancedMesh ref={mesh} args={[undefined, undefined, CELLS.length]}>
        <boxGeometry args={[0.92, 0.92, 0.92]} />
        <meshStandardMaterial color="#ececec" roughness={0.6} />
      </instancedMesh>
    </group>
  )
}
