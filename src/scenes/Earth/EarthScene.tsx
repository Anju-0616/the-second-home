import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '@/utils/scrollStore'
import pointerStore from '@/utils/pointerStore'
import { getPhaseRanges } from '@/data/timeline'
import { lerp, smooth, clamp01 } from '@/utils/math'
import EarthGlobe from './EarthGlobe'
import EarthCracks from './EarthCracks'
import EarthExplosion from './EarthExplosion'
import StarField from './StarField'
import { usePhaseVisibility } from '@/hooks/usePhaseVisibility'

const PHASE_INDEX = getPhaseRanges().findIndex((p) => p.id === 'earth')
const OFFSET_Z = -22

function EarthScene() {
  const { camera } = useThree()
  const sunLight = useRef<THREE.DirectionalLight>(null)
  const lookTarget = useRef(new THREE.Vector3(0, 0, OFFSET_Z))
  const groupRef = usePhaseVisibility(PHASE_INDEX)

  useFrame((state) => {
  if (scrollStore.activeIndex !== PHASE_INDEX) return
  const lp = scrollStore.localProgress
  const t = state.clock.elapsedTime

  let tz: number
  let shakeAmt = 0
  if (lp < 0.5) {
    const p = smooth(lp / 0.5)
    tz = lerp(12, 8, p) // was 4 — 8 keeps us safely outside the radius-4 globe
  } else {
    const p = smooth((lp - 0.5) / 0.5)
    tz = lerp(8, 15, p) // pull back further to frame the explosion (radius up to 7) properly
    shakeAmt = clamp01((lp - 0.78) / 0.22) * 0.12
  }

  const shakeX = (Math.random() - 0.5) * shakeAmt
  const shakeY = (Math.random() - 0.5) * shakeAmt

  const targetPos = new THREE.Vector3(
    Math.sin(t * 0.06) * 2 + pointerStore.x * 0.6 + shakeX,
    1 + pointerStore.y * 0.4 + shakeY,
    tz + OFFSET_Z,
  )
  camera.position.lerp(targetPos, 0.07)

  const targetLook = new THREE.Vector3(0, 0, OFFSET_Z)
  lookTarget.current.lerp(targetLook, 0.07)
  camera.lookAt(lookTarget.current)
})

  return (
    <group ref={groupRef} position={[0, 0, OFFSET_Z]}>
      <ambientLight color="#1a2540" intensity={0.7} />
      <directionalLight ref={sunLight} color="#dfeaff" intensity={1.1} position={[10, 8, 15]} />
      <StarField />
      <EarthGlobe />
      <EarthCracks />
      <EarthExplosion />
    </group>
  )
}

export default EarthScene