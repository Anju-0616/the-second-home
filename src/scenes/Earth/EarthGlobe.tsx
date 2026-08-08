import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '@/utils/scrollStore'
import { getPhaseRanges } from '@/data/timeline'
import { smooth } from '@/utils/math'

const PHASE_INDEX = getPhaseRanges().findIndex((p) => p.id === 'earth')

function EarthGlobe() {
  const body = useRef<THREE.Mesh>(null)
  const bodyMat = useRef<THREE.MeshStandardMaterial>(null)
  const clouds = useRef<THREE.Mesh>(null)
  const cloudsMat = useRef<THREE.MeshBasicMaterial>(null)
  const glow = useRef<THREE.Mesh>(null)

  useFrame((_, dt) => {
    body.current && (body.current.rotation.y += dt * 0.04)
    clouds.current && (clouds.current.rotation.y += dt * 0.06)
    glow.current && (glow.current.rotation.y += dt * 0.02)

    if (scrollStore.activeIndex !== PHASE_INDEX) return
    const lp = scrollStore.localProgress

    // heats up as cracks spread, cools/dims into the explosion
    const heat = smooth((lp - 0.35) / 0.35)
    if (bodyMat.current) {
      bodyMat.current.emissive.setHex(0x0a2a4a).lerp(new THREE.Color(0xff5522), heat)
      bodyMat.current.emissiveIntensity = 0.25 + heat * 1.4
    }
    if (cloudsMat.current) cloudsMat.current.opacity = 0.15 * (1 - smooth((lp - 0.6) / 0.3))
  })

  return (
    <group>
      <mesh ref={body}>
        <sphereGeometry args={[4, 48, 48]} />
        <meshStandardMaterial
          ref={bodyMat}
          color="#1b4e8c"
          roughness={0.7}
          metalness={0.1}
          emissive="#0a2a4a"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh ref={clouds}>
        <sphereGeometry args={[4.15, 32, 32]} />
        <meshBasicMaterial ref={cloudsMat} color="#dfeeff" wireframe transparent opacity={0.15} />
      </mesh>
      <mesh ref={glow}>
        <sphereGeometry args={[4.4, 24, 24]} />
        <meshBasicMaterial color="#4ce0e8" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

export default EarthGlobe