import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function LabMiniature() {
  const core = useRef<THREE.Group>(null)
  const sphere = useRef<THREE.Mesh>(null)

  useFrame((state, dt) => {
    if (core.current) core.current.rotation.y += dt * 0.12
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.06
    sphere.current?.scale.setScalar(pulse)
  })

  return (
    <group ref={core}>
      <pointLight color="#9fFFFb" intensity={2.4} distance={10} decay={2} />
      <mesh ref={sphere}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="#9fFFFb" emissive="#4ce0e8" emissiveIntensity={1.2} transparent opacity={0.4} />
      </mesh>
      <mesh>
        <boxGeometry args={[1.6, 1, 1.6]} />
        <meshStandardMaterial color="#0b1622" transparent opacity={0.25} roughness={0.2} metalness={0.5} />
      </mesh>
    </group>
  )
}

export default LabMiniature