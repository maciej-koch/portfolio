import * as THREE from 'three'
import { RADIUS } from '@/lib/layout'
import type { Fit, Shape } from './types'

// transform that centers a shape and scales it to RADIUS, whatever units it was authored in
// (applied through JSX rather than by reparenting, so StrictMode's double useMemo stays harmless)
export function fit(shape: Shape): Fit {
  const sphere = new THREE.Box3().setFromObject(shape.object).getBoundingSphere(new THREE.Sphere())
  const scale = RADIUS / sphere.radius
  return { ...shape, scale, position: sphere.center.multiplyScalar(-scale) }
}

// every material of an object, made fadeable; the opacity it was authored with is kept in userData
export function materialsOf(object: THREE.Object3D) {
  const out: THREE.Material[] = []
  object.traverse((o) => {
    if (!(o instanceof THREE.Mesh || o instanceof THREE.Points || o instanceof THREE.LineSegments)) return
    for (const m of [o.material].flat() as THREE.MeshBasicMaterial[]) {
      m.userData.opacity = m.opacity
      m.transparent = true
      // no mipmaps: the texture atlas has no padding between islands, so minification bleeds neighbour colors into seams
      if (m.map && o instanceof THREE.Mesh && !(m.map instanceof THREE.CanvasTexture)) {
        m.map.generateMipmaps = false
        m.map.minFilter = THREE.LinearFilter
        m.map.needsUpdate = true
      }
      out.push(m)
    }
  })
  return out
}
