import * as THREE from 'three'
import { BOX } from './constants'

// Random points filling the view between BOX.far and BOX.near: a dots geometry plus a streaks one (head + tail per dot).
export function dust(count: number, width: number, height: number, cameraZ: number) {
  const positions = new Float32Array(count * 3)
  const rand = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const z = BOX.far + Math.random() * (BOX.near - BOX.far)
    const spread = ((cameraZ - z) / cameraZ) * 1.1 // the visible area grows with distance from the camera
    positions[i * 3] = (Math.random() - 0.5) * width * spread
    positions[i * 3 + 1] = (Math.random() - 0.5) * height * spread
    positions[i * 3 + 2] = z
    rand[i] = Math.random()
  }
  const dots = new THREE.BufferGeometry()
  dots.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  dots.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))
  dots.setAttribute('aTarget', new THREE.BufferAttribute(positions.slice(), 3)) // filled when a drawing is summoned

  const positions2 = new Float32Array(count * 6)
  const rand2 = new Float32Array(count * 2)
  const tail = new Float32Array(count * 2)
  for (let i = 0; i < count; i++) {
    positions2.set(positions.subarray(i * 3, i * 3 + 3), i * 6)
    positions2.set(positions.subarray(i * 3, i * 3 + 3), i * 6 + 3)
    rand2[i * 2] = rand2[i * 2 + 1] = rand[i]
    tail[i * 2 + 1] = 1
  }
  const streaks = new THREE.BufferGeometry()
  streaks.setAttribute('position', new THREE.BufferAttribute(positions2, 3))
  streaks.setAttribute('aRand', new THREE.BufferAttribute(rand2, 1))
  streaks.setAttribute('aTail', new THREE.BufferAttribute(tail, 1))
  return { dots, streaks }
}
