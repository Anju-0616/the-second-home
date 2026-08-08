import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import pointerStore from '@/utils/pointerStore'

function HologramCore() {
  const core = useRef<THREE.Group>(null)
  const coreSphere = useRef<THREE.Mesh>(null)
  const coreWire = useRef<THREE.Mesh>(null)
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)
  const light = useRef<THREE.PointLight>(null)

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (!core.current) return

    core.current.rotation.y += dt * 0.15
    core.current.rotation.x += (pointerStore.y * 0.25 - core.current.rotation.x) * 0.04
    core.current.rotation.z += (-pointerStore.x * 0.15 - core.current.rotation.z) * 0.04

    if (coreWire.current) coreWire.current.rotation.y -= dt * 0.1
    if (ring1.current) ring1.current.rotation.z += dt * 0.12
    if (ring2.current) ring2.current.rotation.z -= dt * 0.09

    const pulse = 1 + Math.sin(t * 1.6) * 0.05
    coreSphere.current?.scale.setScalar(pulse)
    if (light.current) light.current.intensity = 2.6 + Math.sin(t * 1.6) * 0.6
  })

  return (
    <group ref={core} position={[0, 1.4, 0]}>
      <pointLight ref={light} color="#9fFFFb" intensity={3} distance={12} decay={2} />
      <mesh ref={coreSphere}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial
          color="#9fFFFb"
          emissive="#4ce0e8"
          emissiveIntensity={1.4}
          transparent
          opacity={0.35}
        />
      </mesh>
      <mesh ref={coreWire}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial color="#4ce0e8" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring1} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.1, 0.02, 8, 80]} />
        <meshBasicMaterial color="#4ce0e8" />
      </mesh>
      <mesh ref={ring2} rotation={[-Math.PI / 2.6, 0, Math.PI / 4]} scale={1.25}>
        <torusGeometry args={[2.1, 0.02, 8, 80]} />
        <meshBasicMaterial color="#4ce0e8" />
      </mesh>
    </group>
  )
}

export default HologramCore