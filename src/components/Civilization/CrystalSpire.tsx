import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CrystalSpireProps {
  position: [number, number, number]
  color?: string
  scale?: number
}

function CrystalSpire({ position, color = '#a855f7', scale = 1 }: CrystalSpireProps) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.06
    }
  })

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh position={[0, 1.4, 0]}>
        <coneGeometry args={[0.5, 2.8, 6]} />
        <meshStandardMaterial color="#1a1428" emissive={color} emissiveIntensity={0.7} roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0.5, 0.5, 0.3]} scale={0.5}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#1a1428" emissive={color} emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[-0.4, 0.3, -0.3]} scale={0.4}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#1a1428" emissive={color} emissiveIntensity={0.9} />
      </mesh>
    </group>
  )
}

export default CrystalSpire