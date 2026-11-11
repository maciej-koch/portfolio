import { Canvas } from '@react-three/fiber'
import Particles from '@/components/Particles'
import Digits from './Digits'

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 11], fov: 35 }} dpr={[1, 2]}>
      <hemisphereLight args={['#ffffff', '#222222', 1.5]} />
      <directionalLight position={[3, 5, 4]} intensity={2} />
      <Digits />
      <Particles />
    </Canvas>
  )
}
