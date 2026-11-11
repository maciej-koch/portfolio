import { Canvas } from '@react-three/fiber'
import Model from '@/components/Model'
import Particles from '@/components/Particles'

export default function Scene({ active }: { active: number }) {
  return (
    <Canvas camera={{ position: [0, 0, 11], fov: 35 }} dpr={[1, 2]}>
      {/* soft light for the stack blocks; textured models are unlit and ignore it */}
      <hemisphereLight args={['#ffffff', '#222222', 1.5]} />
      <directionalLight position={[3, 5, 4]} intensity={2} />
      <Model active={active} />
      <Particles />
    </Canvas>
  )
}
