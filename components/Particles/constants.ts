import * as THREE from 'three'
import type { Drawing } from '@/lib/drawings'

export const COUNT = { phone: 600, desktop: 1200 }
export const BOX = { near: 1, far: -8 } // z range the dust lives in (camera sits at z = 11)
export const SIZE = 44
export const WARP_SPEED = 40
export const CRASH = new THREE.Color('#ff3b30') // the dust of a wiped disk
export const GLOW: Record<Drawing, THREE.Color> = {
  mellon: new THREE.Color('#bfe3ff'), // the doors' moonlit ithildin
  lumos: new THREE.Color('#ffe6a8'), // wand light
  xp: new THREE.Color('#a6ff4f'), // experience orb green
  victory: new THREE.Color('#ffd25e'), // gold
}
