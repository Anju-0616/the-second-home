import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '@/utils/scrollStore'
import pointerStore from '@/utils/pointerStore'
import { getPhaseRanges } from '@/data/timeline'
import { lerp, smooth } from '@/utils/math'
import DeepStars from './DeepStars'
import AsteroidField from './AsteroidField'
import Nebula from './Nebula'
import ConstellationLines from './ConstellationLines'
import SpaceParticles from './SpaceParticles'
import WorldGlow from './WorldGlow'

const PHASE_INDEX = getPhaseRanges().findIndex((p) => p.id === 'space')
const OFFSET_Z = -50

function SpaceScene() {
  const { camera } = useThree()
  const lookTarget = useRef(new THREE.Vector3(0, 0, OFFSET_Z))

  useFrame(() => {
    if (scrollStore.activeIndex !== PHASE_INDEX) return
    const lp = scrollStore.localProgress

    const tz = lerp(16, -130, smooth(lp))
    const targetPos = new THREE.Vector3(
      pointerStore.x * 1.3,
      pointerStore.y * 0.9,
      tz + OFFSET_Z,
    )
    camera.position.lerp(targetPos, 0.08)

    const targetLook = new THREE.Vector3(pointerStore.x * 3, pointerStore.y * 1.5, tz - 18 + OFFSET_Z)
    lookTarget.current.lerp(targetLook, 0.08)
    camera.lookAt(lookTarget.current)
    camera.rotation.z += (-pointerStore.x * 0.1 - camera.rotation.z) * 0.05
  })

  return (
    <group position={[0, 0, OFFSET_Z]}>
      <ambientLight color="#141c30" intensity={0.6} />
      <directionalLight color="#dfeaff" intensity={0.5} position={[8, 6, 10]} />
      <DeepStars />
      <ConstellationLines />
      <AsteroidField />
      <Nebula />
      <SpaceParticles />
      <WorldGlow />
    </group>
  )
}

export default SpaceScene