import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '@/utils/scrollStore'
import { getPhaseRanges } from '@/data/timeline'
import { smooth } from '@/utils/math'

const PHASE_INDEX = getPhaseRanges().findIndex((p) => p.id === 'space')

function WorldGlow() {
  const body = useRef<THREE.Mesh>(null)
  const bodyMat = useRef<THREE.MeshStandardMaterial>(null)
  const glow = useRef<THREE.Mesh>(null)
  const glowMat = useRef<THREE.MeshBasicMaterial>(null)

  useFrame((state) => {
    body.current && (body.current.rotation.y += 0.0015)
    if (scrollStore.activeIndex !== PHASE_INDEX) return
    const lp = scrollStore.localProgress
    const reveal = smooth((lp - 0.7) / 0.3)

    if (bodyMat.current) bodyMat.current.emissiveIntensity = 0.3 + reveal * 0.6
    if (glowMat.current) glowMat.current.opacity = reveal * 0.35
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.02 * reveal
    body.current?.scale.setScalar(pulse)
  })

  return (
    <group position={[0, 2, -135]}>
      <mesh ref={body}>
        <sphereGeometry args={[11, 32, 32]} />
        <meshStandardMaterial
          ref={bodyMat}
          color="#e8b64c"
          emissive="#d94ce0"
          emissiveIntensity={0.3}
          roughness={0.4}
        />
      </mesh>
      <mesh ref={glow}>
        <sphereGeometry args={[11.6, 24, 24]} />
        <meshBasicMaterial ref={glowMat} color="#ffb84c" transparent opacity={0} />
      </mesh>
    </group>
  )
}

export default WorldGlow