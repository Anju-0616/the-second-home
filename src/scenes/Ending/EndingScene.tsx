import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '@/utils/scrollStore'
import pointerStore from '@/utils/pointerStore'
import { getPhaseRanges } from '@/data/timeline'
import { lerp, smooth } from '@/utils/math'
import LabMiniature from '@/components/Civilization/LabMiniature'
import ArchivePortals from './ArchivePortals'
import StarField from '@/components/Stars/StarField'

const PHASE_INDEX = getPhaseRanges().findIndex((p) => p.id === 'ending')
const OFFSET_Z = -364

function EndingScene() {
  const { camera } = useThree()
  const lookTarget = useRef(new THREE.Vector3(0, 0.5, OFFSET_Z))

  useFrame(() => {
    if (scrollStore.activeIndex !== PHASE_INDEX) return
    const lp = scrollStore.localProgress
    const p = smooth(lp)

    const tz = lerp(6, 70, p)
    const ty = 1 + p * 5

    const targetPos = new THREE.Vector3(pointerStore.x * 0.8, ty + pointerStore.y * 0.4, tz + OFFSET_Z)
    camera.position.lerp(targetPos, 0.05)

    const targetLook = new THREE.Vector3(0, 0.5, OFFSET_Z)
    lookTarget.current.lerp(targetLook, 0.05)
    camera.lookAt(lookTarget.current)
  })

  return (
    <group position={[0, 0, OFFSET_Z]}>
      <ambientLight color="#0a0f1a" intensity={0.4} />
      <StarField count={600} spreadX={140} spreadY={100} zFront={40} zSpread={220} opacity={0.6} parallax={0.4} />
      <ArchivePortals />
      <LabMiniature />
    </group>
  )
}

export default EndingScene