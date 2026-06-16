import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

const FIREWORK_PARTICLES = 150
const FIREWORK_DURATION = 2000

interface SingleFireworkProps {
  id: number
  position: [number, number, number]
  onDone: (id: number) => void
}

function SingleFirework({ id, position, onDone }: SingleFireworkProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const startTime = useRef(Date.now())
  const velocityRef = useRef<Float32Array | null>(null)

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(FIREWORK_PARTICLES * 3)
    const colors = new Float32Array(FIREWORK_PARTICLES * 3)
    const sizes = new Float32Array(FIREWORK_PARTICLES)
    const velocities = new Float32Array(FIREWORK_PARTICLES * 3)

    const palette = [
      new THREE.Color('#ffd700'),
      new THREE.Color('#ff4444'),
      new THREE.Color('#ffffff'),
      new THREE.Color('#ff8844'),
      new THREE.Color('#44ffcc'),
    ]

    for (let i = 0; i < FIREWORK_PARTICLES; i++) {
      positions[i * 3] = position[0]
      positions[i * 3 + 1] = position[1]
      positions[i * 3 + 2] = position[2]

      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const speed = 0.8 + Math.random() * 1.5

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed
      velocities[i * 3 + 2] = Math.cos(phi) * speed

      const color = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      sizes[i] = 0.8 + Math.random() * 1.5
    }

    velocityRef.current = velocities
    return { positions, colors, sizes }
  }, [position])

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: 1.0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uOpacity;
        uniform float uPixelRatio;
        void main() {
          vColor = aColor;
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          gl_Position = projectionMatrix * viewPosition;
          gl_PointSize = aSize * uPixelRatio * (150.0 / -viewPosition.z);
          gl_PointSize = max(gl_PointSize, 0.5);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float uOpacity;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * uOpacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return
    const elapsed = Date.now() - startTime.current
    const progress = Math.min(elapsed / FIREWORK_DURATION, 1.0)

    if (progress >= 1.0) {
      onDone(id)
      return
    }

    shaderMaterial.uniforms.uOpacity.value = 1.0 - progress * progress

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const posArray = posAttr.array as Float32Array
    const vel = velocityRef.current!

    const dt = 0.016
    for (let i = 0; i < FIREWORK_PARTICLES; i++) {
      const idx = i * 3
      posArray[idx] += vel[idx] * dt
      posArray[idx + 1] += vel[idx + 1] * dt - 2.0 * dt * progress
      posArray[idx + 2] += vel[idx + 2] * dt

      vel[idx] *= 0.985
      vel[idx + 1] *= 0.985
      vel[idx + 2] *= 0.985
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={FIREWORK_PARTICLES}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aColor"
          count={FIREWORK_PARTICLES}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={FIREWORK_PARTICLES}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  )
}

export default function FireworkSystem() {
  const fireworks = useStore((s) => s.fireworks)
  const removeFirework = useStore((s) => s.removeFirework)

  return (
    <group>
      {fireworks.map((fw) => (
        <SingleFirework
          key={fw.id}
          id={fw.id}
          position={fw.position}
          onDone={removeFirework}
        />
      ))}
    </group>
  )
}
