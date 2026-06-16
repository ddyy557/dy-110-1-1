import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

const PARTICLE_COUNT = 8000
const TREE_HEIGHT = 6
const BASE_RADIUS = 2.8
const SPIRALS = 10

export default function TreeParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const rotationSpeed = useStore((s) => s.rotationSpeed)
  const mouseX = useStore((s) => s.mouseX)
  const mouseY = useStore((s) => s.mouseY)

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)

    const colorBottom = new THREE.Color('#ff4444')
    const colorMid1 = new THREE.Color('#ffd700')
    const colorMid2 = new THREE.Color('#44ff88')
    const colorTop = new THREE.Color('#88ccff')

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = i / PARTICLE_COUNT
      const height = t * TREE_HEIGHT
      const radius = BASE_RADIUS * (1 - t) * (0.8 + 0.2 * Math.sin(t * Math.PI * 3))

      const spiralAngle = t * SPIRALS * Math.PI * 2 + (Math.random() - 0.5) * 0.6
      const r = radius * (0.3 + 0.7 * Math.random())

      positions[i * 3] = Math.cos(spiralAngle) * r
      positions[i * 3 + 1] = height - TREE_HEIGHT * 0.35
      positions[i * 3 + 2] = Math.sin(spiralAngle) * r

      let color: THREE.Color
      if (t < 0.3) {
        color = colorBottom.clone().lerp(colorMid1, t / 0.3)
      } else if (t < 0.6) {
        color = colorMid1.clone().lerp(colorMid2, (t - 0.3) / 0.3)
      } else {
        color = colorMid2.clone().lerp(colorTop, (t - 0.6) / 0.4)
      }
      color.offsetHSL((Math.random() - 0.5) * 0.05, 0, (Math.random() - 0.5) * 0.1)

      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      sizes[i] = 0.9 + Math.random() * 1.3
    }

    return { positions, colors, sizes }
  }, [])

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uTime;
        uniform float uPixelRatio;
        void main() {
          vColor = aColor;
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          float twinkle = sin(uTime * 2.5 + position.x * 8.0 + position.z * 8.0) * 0.4 + 0.8;
          vec4 viewPosition = viewMatrix * modelPosition;
          gl_Position = projectionMatrix * viewPosition;
          gl_PointSize = aSize * uPixelRatio * twinkle * (420.0 / -viewPosition.z);
          gl_PointSize = max(gl_PointSize, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha = pow(alpha, 1.5);
          gl_FragColor = vec4(vColor, alpha * 0.9);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.getElapsedTime()
    shaderMaterial.uniforms.uTime.value = t

    const autoRotation = t * rotationSpeed
    const mouseInfluenceX = mouseX * 0.3
    const mouseInfluenceY = mouseY * 0.15
    pointsRef.current.rotation.y = autoRotation + mouseInfluenceX
    pointsRef.current.rotation.x = mouseInfluenceY
  })

  return (
    <points ref={pointsRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aColor"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  )
}
