import { Canvas } from '@react-three/fiber'
import TreeParticles from './TreeParticles'
import StarTop from './StarTop'
import SnowSystem from './SnowSystem'
import FireworkSystem from './FireworkSystem'
import CameraController from './CameraController'
import Effects from './Effects'
import { useStore } from '@/store/useStore'

export default function ChristmasTreeScene() {
  const setMousePosition = useStore((s) => s.setMousePosition)
  const triggerFirework = useStore((s) => s.triggerFirework)

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1
    const y = -(e.clientY / window.innerHeight) * 2 + 1
    setMousePosition(x, y)
  }

  const handleClick = () => {
    triggerFirework()
  }

  return (
    <div
      className="w-full h-full"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      style={{ background: '#0a0a1a' }}
    >
      <Canvas
        camera={{ position: [0, 5, 10], fov: 55, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ background: '#0a0a1a' }}
      >
        <color attach="background" args={['#0a0a1a']} />
        <ambientLight intensity={0.15} />
        <CameraController />
        <TreeParticles />
        <StarTop />
        <SnowSystem />
        <FireworkSystem />
        <Effects />
      </Canvas>
    </div>
  )
}
