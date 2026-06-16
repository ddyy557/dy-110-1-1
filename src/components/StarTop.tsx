import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

export default function StarTop() {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const rotationSpeed = useStore((s) => s.rotationSpeed)
  const mouseX = useStore((s) => s.mouseX)
  const mouseY = useStore((s) => s.mouseY)

  const starMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);
          float pulse = sin(uTime * 3.0) * 0.15 + 0.85;
          float glow = exp(-dist * 4.0) * pulse;
          float core = exp(-dist * 20.0);
          vec3 goldColor = vec3(1.0, 0.85, 0.3);
          vec3 whiteCore = vec3(1.0, 1.0, 0.95);
          vec3 finalColor = mix(goldColor, whiteCore, core) * (glow + core * 2.0);
          float alpha = glow + core;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    starMaterial.uniforms.uTime.value = t

    if (meshRef.current) {
      const autoRotation = t * rotationSpeed
      meshRef.current.rotation.y = autoRotation + mouseX * 0.3
      meshRef.current.rotation.x = mouseY * 0.15
    }
    if (glowRef.current) {
      const autoRotation = t * rotationSpeed
      glowRef.current.rotation.y = autoRotation + mouseX * 0.3
      glowRef.current.rotation.x = mouseY * 0.15
    }
  })

  return (
    <group>
      <mesh ref={meshRef} position={[0, 4.2, 0]} material={starMaterial}>
        <planeGeometry args={[2.5, 2.5]} />
      </mesh>
      <mesh ref={glowRef} position={[0, 4.2, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.95} />
      </mesh>
      <pointLight
        position={[0, 4.2, 0]}
        color="#ffd700"
        intensity={5}
        distance={12}
        decay={2}
      />
    </group>
  )
}
