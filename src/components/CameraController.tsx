import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store/useStore'

export default function CameraController() {
  const { camera } = useThree()
  const mouseX = useStore((s) => s.mouseX)
  const mouseY = useStore((s) => s.mouseY)
  const targetRotation = useRef({ x: 0, y: 0 })

  useFrame(() => {
    const targetX = mouseY * 0.3
    const targetY = mouseX * 0.5

    targetRotation.current.x += (targetX - targetRotation.current.x) * 0.03
    targetRotation.current.y += (targetY - targetRotation.current.y) * 0.03

    const radius = 10
    const baseAngleY = 0
    const angleY = baseAngleY + targetRotation.current.y
    const angleX = 0.4 + targetRotation.current.x

    camera.position.x = Math.sin(angleY) * Math.cos(angleX) * radius
    camera.position.y = Math.sin(angleX) * radius + 1
    camera.position.z = Math.cos(angleY) * Math.cos(angleX) * radius
    camera.lookAt(0, 1.5, 0)
  })

  return null
}
