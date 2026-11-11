import { Canvas } from '@react-three/fiber'
import Particles from '@/components/Particles'

// just the dust, like the portfolio's background; nothing on this page fires eggs, so it stays calm
export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 11], fov: 35 }} dpr={[1, 2]}>
      <Particles />
    </Canvas>
  )
}
