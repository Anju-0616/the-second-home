import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface DroneData {
  radius: number
  speed: number
  angle: number
  height: number
  vOff: number
}

function LabDrones({ count = 5 }: { count?: number }) {
  const group = useRef<THREE.Group>(null)

  const drones = useMemo<DroneData[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        radius: 3.5 + Math.random() * 2.5,
        speed: 0.15 + Math.random() * 0.15,
        angle: (i / count) * Math.PI * 2,
        height: 1 + Math.random() * 2,
        vOff: Math.random() * 10,
      })),
    [count],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    group.current?.children.forEach((child, i) => {
      const d = drones[i]
      const a = d.angle + t * d.speed
      child.position.set(
        Math.cos(a) * d.radius,
        d.height + Math.sin(t * 0.7 + d.vOff) * 0.3,
        Math.sin(a) * d.radius - 4,
      )
    })
  })

  return (
    <group ref={group}>
      {drones.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color="#0c1620" emissive="#3a7bff" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

export default LabDrones