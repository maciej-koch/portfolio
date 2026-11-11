import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { egg, SECONDS } from '@/lib/eggs'
import { BLOCK, BOTTLE, STACK } from './constants'
import { labelTexture } from './labels'
import type { Shape } from './types'

const smoothstep = (p: number) => p * p * (3 - 2 * p)

const label = (text: string, w: number, h: number) =>
  new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: labelTexture(text), transparent: true, depthWrite: false }))

const DIRS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]] as const
const half = (v: number) => Math.abs(v + 0.5) // distance of voxel v's center from the axis
const pick = (shades: string[]) => shades[Math.floor(Math.random() * shades.length)]

// what fills voxel (x, y, z) of the bottle: the one-voxel shell is glass, the inside is liquid up to the fill level
// and air above, the lip and the two rows over it hold the cork
function voxel(x: number, y: number, z: number) {
  const { rows, fill, cork } = BOTTLE
  if (y >= cork.from && y < cork.to && half(x) <= cork.half && half(z) <= cork.half) return 'cork'
  const within = (x: number, y: number, z: number) => {
    const w = rows[y]
    return w !== undefined && half(x) < w && half(z) < w && !(w > 2 && half(x) > w - 1 && half(z) > w - 1) // corners cut
  }
  if (!within(x, y, z)) return 'air'
  if (DIRS.some(([dx, dy, dz]) => !within(x + dx, y + dy, z + dz))) return 'glass'
  return y <= fill ? 'liquid' : 'air'
}

// a Minecraft-style bottle of experience: voxels drawn as instanced squares (only the faces between different
// materials), "XP" written in darker voxels on the front of the liquid, square orbs rising inside and up the neck
function potion(): Shape {
  const { rows, mark, colors, orbs: n, neckOrbs, speed } = BOTTLE
  const faces: Record<Exclude<ReturnType<typeof voxel>, 'air'>, { matrix: THREE.Matrix4; color: string }[]> = { glass: [], liquid: [], cork: [] }
  const face = new THREE.Object3D()
  const reach = Math.max(...rows)
  for (let y = 0; y < BOTTLE.cork.to; y++)
    for (let x = -reach; x < reach; x++)
      for (let z = -reach; z < reach; z++) {
        const kind = voxel(x, y, z)
        if (kind === 'air') continue
        const marked = kind === 'liquid' && z === mark.front && mark.rows[mark.top - y]?.[x - mark.left] === '#'
        for (const [dx, dy, dz] of DIRS) {
          if (voxel(x + dx, y + dy, z + dz) === kind) continue
          face.position.set(x + 0.5 + dx / 2, y + 0.5 + dy / 2, z + 0.5 + dz / 2)
          face.lookAt(x + 0.5 + dx, y + 0.5 + dy, z + 0.5 + dz)
          face.updateMatrix()
          faces[kind].push({ matrix: face.matrix.clone(), color: marked ? colors.mark : pick(colors[kind]) })
        }
      }
  const square = new THREE.PlaneGeometry(1, 1)
  const mesh = <M extends THREE.Material>(kind: keyof typeof faces, material: M) => {
    const m = new THREE.InstancedMesh(square, material, faces[kind].length)
    faces[kind].forEach(({ matrix, color }, i) => {
      m.setMatrixAt(i, matrix)
      m.setColorAt(i, new THREE.Color(color))
    })
    return m
  }
  const liquid = mesh('liquid', new THREE.MeshStandardMaterial({ roughness: 0.5, emissive: colors.glow, emissiveIntensity: 0.25 }))
  const cork = mesh('cork', new THREE.MeshStandardMaterial({ roughness: 0.9 }))
  const glass = mesh('glass', new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.3, roughness: 0.3, depthWrite: false }))
  glass.renderOrder = 2

  // orbs fill the liquid; the last few climb the neck, as if the XP were escaping
  const column = (i: number) => (i < n - neckOrbs ? { r: 3.5, from: 1, to: 8.5 } : { r: 0.8, from: 9.5, to: 13.5 })
  const positions = new Float32Array(n * 3)
  const phase = Float32Array.from({ length: n }, () => Math.random() * Math.PI * 2)
  for (let i = 0; i < n; i++) {
    const { r, from, to } = column(i)
    const d = Math.sqrt(Math.random()) * r
    const a = Math.random() * Math.PI * 2
    positions.set([d * Math.cos(a), from + Math.random() * (to - from), d * Math.sin(a)], i * 3)
  }
  const orbs = new THREE.Points(
    new THREE.BufferGeometry()
      .setAttribute('position', new THREE.BufferAttribute(positions, 3))
      .setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3)),
    new THREE.PointsMaterial({ size: 0.09, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, depthTest: false, depthWrite: false }),
  )
  orbs.renderOrder = 3
  const group = new THREE.Group()
  group.add(liquid, cork, glass, orbs)

  const [green, yellow] = colors.orb.map((c) => new THREE.Color(c))
  const tint = new THREE.Color()
  const animate = (t: number, delta: number) => {
    liquid.material.emissiveIntensity = 0.25 + 0.1 * Math.sin(t * 2)
    const p = orbs.geometry.getAttribute('position') as THREE.BufferAttribute
    const c = orbs.geometry.getAttribute('color') as THREE.BufferAttribute
    for (let i = 0; i < n; i++) {
      const { from, to } = column(i)
      const y = p.getY(i) + delta * speed
      p.setY(i, y > to ? from : y)
      const k = 0.5 + 0.5 * Math.sin(t * 3 + phase[i]) // Minecraft orbs pulse between green and yellow
      tint.lerpColors(green, yellow, k).multiplyScalar(0.2 + 0.6 * k)
      c.setXYZ(i, tint.r, tint.g, tint.b)
    }
    p.needsUpdate = c.needsUpdate = true
  }
  return { object: group, animate }
}

// a stack of blocks labelled with the technologies; the bottom one keeps climbing to the top. Each tap adds a block on
// top and the tower sways harder; one too many and it topples over with a StackOverflowError (the 'stack' egg)
function stack(): Shape {
  const { names, period, height, gap, overflow, sway } = STACK
  const n = names.length
  const slot = height + gap
  const geometry = new RoundedBoxGeometry(2.2, height, 1.2, 4, 0.08)
  // a sharp box just inside the rounded one, so its edges run along the rounding
  const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.2 - 0.04, height - 0.04, 1.2 - 0.04))
  // shared, so blocks added later fade with the section like the rest (Model collects materials once)
  const body = new THREE.MeshStandardMaterial({ color: BLOCK.color, emissive: BLOCK.emissive, roughness: 0.7 })
  const edge = new THREE.LineBasicMaterial({ color: BLOCK.edge, transparent: true, opacity: BLOCK.edgeOpacity })
  const group = new THREE.Group()
  const faceOf = (block: THREE.Object3D) => block.children[0] as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>
  // the spares for taps are built up front and hidden inside the tower, so they don't change its fitted size
  const all = Array.from({ length: n + overflow }, (_, i) => {
    const block = new THREE.Mesh(geometry, body)
    const face = label(names[i % names.length], 1.9, 0.42)
    face.position.z = 0.601
    block.add(face, new THREE.LineSegments(edges, edge))
    block.position.y = i < n ? i * slot : 0
    block.visible = i < n
    group.add(block)
    return block
  })
  const blocks = all.slice(0, n)
  const spares = all.slice(n)
  const error = label('StackOverflowError', 3.4, 0.85)
  error.material.map = labelTexture('StackOverflowError', '#ff5f56')
  error.visible = false
  group.add(error)
  let next = n % names.length
  let cycle = 0
  let toppled = -1 // performance.now() when the tower fell (real time, so it rebuilds even with reduced motion), -1 while standing
  const fall = new Map<THREE.Object3D, { v: THREE.Vector3; spin: number }>()

  const poke = () => {
    if (toppled >= 0) return
    const block = spares.pop()
    if (!block) {
      // one too many: everything falls the way the tower leans
      toppled = performance.now()
      const side = Math.sign(group.rotation.z) || 1
      blocks.forEach((b, i) =>
        fall.set(b, { v: new THREE.Vector3(-side * (0.6 + i * 0.25 + Math.random()), 1 + Math.random() * 2, Math.random() * 2 - 1), spin: side * (1 + Math.random() * 3) }),
      )
      error.position.set(0, (n / 2) * slot, 1.5)
      error.visible = true
      egg('stack')
      return
    }
    faceOf(block).material.map = labelTexture(names[next])
    next = (next + 1) % names.length
    block.position.y = blocks.length * slot
    block.visible = true
    blocks.push(block)
  }

  const animate = (t: number, delta: number) => {
    const c = Math.floor(t / period)
    if (toppled >= 0) {
      cycle = c // the climb pauses while the tower is down
      for (const [b, f] of fall) {
        f.v.y -= 12 * delta
        b.position.addScaledVector(f.v, delta)
        b.rotation.z += f.spin * delta
      }
      if (performance.now() - toppled < SECONDS.stack * 1000) return
      // rebuilt: the spares go back inside, the original blocks stand again
      for (const b of blocks.splice(n)) {
        b.visible = false
        b.position.set(0, 0, 0)
        spares.push(b)
      }
      for (const b of blocks) b.rotation.set(0, 0, 0)
      fall.clear()
      error.visible = false
      toppled = -1
    }
    for (; cycle < c; cycle++) {
      // the climbing block has arrived: it becomes the top and shows the next technology
      const block = blocks.shift()!
      blocks.push(block)
      faceOf(block).material.map = labelTexture(names[next])
      next = (next + 1) % names.length
    }
    const p = t / period - c
    const e = smoothstep(p)
    const top = blocks.length - 1
    blocks.forEach((block, i) => {
      // the climber swings out towards the viewer, the rest settle one slot down
      if (i === 0) block.position.set(0, e * top * slot, Math.sin(p * Math.PI) * 1.5)
      else block.position.set(0, (i - e) * slot, 0)
    })
    // every added block makes the tower sway harder
    const load = (blocks.length - n) / overflow
    group.rotation.z = Math.sin(t * 4) * sway * load * load
  }
  return { object: group, animate, poke }
}

const BUILDERS: Record<string, () => Shape> = { potion, stack }

// a procedural, mono shape for a section (see content.sections[].shape)
export function shape(name: string) {
  const build = BUILDERS[name]
  if (!build) throw new Error(`unknown shape: ${name}`)
  return build()
}
