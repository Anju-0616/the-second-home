import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '@/utils/scrollStore'
import pointerStore from '@/utils/pointerStore'
import { getPhaseRanges } from '@/data/timeline'
import { lerp, smooth } from '@/utils/math'
import { NEW_WORLDS } from '@/data/planets'
import Planet from '@/components/Planet/Planet'
import StarField from '@/components/Stars/StarField'

const PHASE_INDEX = getPhaseRanges().findIndex((p) => p.id === 'planetOne')
const OFFSET_Z = -202

function PlanetOneScene() {
  const { camera } = useThree()
  const lookTarget = useRef(new THREE.Vector3(0, 0, OFFSET_Z))

  useFrame(() => {
    if (scrollStore.activeIndex !== PHASE_INDEX) return
    const lp = scrollStore.localProgress

    const tz = lerp(14, -66, smooth(lp))
    const targetPos = new THREE.Vector3(
      pointerStore.x * 1.2,
      1 + pointerStore.y * 0.7,
      tz + OFFSET_Z,
    )
    camera.position.lerp(targetPos, 0.07)

    const targetLook = new THREE.Vector3(pointerStore.x * 2, pointerStore.y, tz - 16 + OFFSET_Z)
    lookTarget.current.lerp(targetLook, 0.07)
    camera.lookAt(lookTarget.current)
  })

  return (
    <group position={[0, 0, OFFSET_Z]}>
      <ambientLight color="#16101f" intensity={0.5} />
      <directionalLight color="#dfe0ff" intensity={0.4} position={[6, 10, 8]} />
      <StarField count={900} spreadX={90} spreadY={60} zFront={20} zSpread={180} parallax={0.9} />
      {NEW_WORLDS.map((config) => (
        <Planet key={config.name} config={config} />
      ))}
    </group>
  )
}

export default PlanetOneScene