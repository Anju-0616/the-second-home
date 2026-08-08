import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '@/utils/scrollStore'
import pointerStore from '@/utils/pointerStore'
import { getPhaseRanges } from '@/data/timeline'
import { lerp, smooth } from '@/utils/math'
import { ISLANDS } from '@/data/islands'
import FloatingIsland from '@/components/FloatingIsland/FloatingIsland'
import BioMotes from './BioMotes'
import StarField from '@/components/Stars/StarField'

const PHASE_INDEX = getPhaseRanges().findIndex((p) => p.id === 'planetTwo')
const OFFSET_Z = -282

function PlanetTwoScene() {
  const { camera } = useThree()
  const lookTarget = useRef(new THREE.Vector3(0, 0, OFFSET_Z))

  useFrame(() => {
    if (scrollStore.activeIndex !== PHASE_INDEX) return
    const lp = scrollStore.localProgress

    let tz: number
    let ty: number
    if (lp < 0.85) {
      const p = smooth(lp / 0.85)
      tz = lerp(10, -55, p)
      ty = lerp(2, 1, p)
    } else {
      // final pull-back for the title reveal
      const p = smooth((lp - 0.85) / 0.15)
      tz = lerp(-55, -68, p)
      ty = lerp(1, 5, p)
    }

    const targetPos = new THREE.Vector3(pointerStore.x * 1.1, ty + pointerStore.y * 0.5, tz + OFFSET_Z)
    camera.position.lerp(targetPos, 0.06)

    const targetLook = new THREE.Vector3(pointerStore.x * 2, 0, tz - 14 + OFFSET_Z)
    lookTarget.current.lerp(targetLook, 0.06)
    camera.lookAt(lookTarget.current)
  })

  return (
    <group position={[0, 0, OFFSET_Z]}>
      <ambientLight color="#0a1c14" intensity={0.55} />
      <directionalLight color="#e8fff2" intensity={0.5} position={[5, 12, 8]} />
      <StarField count={500} spreadX={70} spreadY={45} zFront={20} zSpread={140} opacity={0.5} parallax={0.6} />
      <BioMotes />
      {ISLANDS.map((config, i) => (
        <FloatingIsland key={i} config={config} />
      ))}
    </group>
  )
}

export default PlanetTwoScene