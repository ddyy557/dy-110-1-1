import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

const SNOW_COUNT = 2000
const AREA_SIZE = 12
const AREA_HEIGHT = 10

export default function SnowSystem() {
  const pointsRef = useRef<THREE.Points>(null)
  const snowEnabled = useStore((s) => s.snowEnabled)

  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(SNOW_COUNT * 3)
    const velocities = new Float32Array(SNOW_COUNT * 3)
    const sizes = new Float32Array(SNOW_COUNT)

    for (let i = 0; i < SNOW_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * AREA_SIZE
      positions[i * 3 + 1] = Math.random() * AREA_HEIGHT
      positions[i * 3 + 2] = (Math.random() - 0.5) * AREA_SIZE

      velocities[i * 3] = (Math.random() - 0.5) * 0.3
      velocities[i * 3 + 1] = -(0.3 + Math.random() * 0.5)
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3

      sizes[i] = 1.0 + Math.random() * 2.0
    }

    return { positions, velocities, sizes }
  }, [])

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float aSize;
        varying float vAlpha;
        uniform float uPixelRatio;
        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          gl_Position = projectionMatrix * viewPosition;
          gl_PointSize = aSize * uPixelRatio * (200.0 / -viewPosition.z);
          gl_PointSize = max(gl_PointSize, 0.5);
          vAlpha = smoothstep(0.0, 1.0, position.y / 10.0) * 0.6 + 0.2;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * vAlpha;
          gl_FragColor = vec4(0.9, 0.95, 1.0, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  useFrame((state) => {
    if (!pointsRef.current || !snowEnabled) return
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const posArray = posAttr.array as Float32Array
    const t = state.clock.getElapsedTime()

    for (let i = 0; i < SNOW_COUNT; i++) {
      const idx = i * 3
      posArray[idx] += Math.sin(t * 0.5 + i * 0.1) * 0.003
      posArray[idx + 1] += velocities[idx + 1] * 0.008
      posArray[idx + 2] += Math.cos(t * 0.3 + i * 0.15) * 0.003

      if (posArray[idx + 1] < -1) {
        posArray[idx] = (Math.random() - 0.5) * AREA_SIZE
        posArray[idx + 1] = AREA_HEIGHT * 0.5 + Math.random() * AREA_HEIGHT * 0.5
        posArray[idx + 2] = (Math.random() - 0.5) * AREA_SIZE
      }
    }
    posAttr.needsUpdate = true
  })

  if (!snowEnabled) return null

  return (
    <points ref={pointsRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={SNOW_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={SNOW_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  )
}
