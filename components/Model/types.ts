import type * as THREE from 'three'

export type Shape = { object: THREE.Object3D; animate?: (t: number, delta: number) => void; poke?: () => void }
export type Fit = Shape & { scale: number; position: THREE.Vector3 }
export type Placement = { x: number; y: number; s: number }
export type Spin = { angle: number; vel: number; dragging: boolean; lastX: number; lastT: number }
