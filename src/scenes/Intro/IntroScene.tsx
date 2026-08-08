import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '@/utils/scrollStore'
import pointerStore from '@/utils/pointerStore'
import HologramCore from './HologramCore'
import LabParticles from './LabParticles'
import LabDoors from './LabDoors'
import LabDrones from './LabDrones'
import LabEnvironment from './LabEnvironment'

const PHASE_INDEX = 0
const OFFSET_Z = 0

function IntroScene() {
  const { camera } = useThree()
  const ambient = useRef<THREE.AmbientLight>(null)
  const rim = useRef<THREE.DirectionalLight>(null)
  const lookTarget = useRef(new THREE.Vector3(0, 1.3, 6))

  useFrame(() => {
    if (scrollStore.activeIndex !== PHASE_INDEX) return
    const lp = scrollStore.localProgress

    const tz = 14 - lp * 16
    const targetPos = new THREE.Vector3(
      pointerStore.x * 0.4,
      1.6 + pointerStore.y * 0.15,
      tz + OFFSET_Z,
    )
    camera.position.lerp(targetPos, 0.07)

    const targetLook = new THREE.Vector3(0, 1.3, tz - 8 + OFFSET_Z)
    lookTarget.current.lerp(targetLook, 0.07)
    camera.lookAt(lookTarget.current)

    const dimStart = 0.55
    const dimEnd = 0.7
    const dim = lp > dimStart ? 1 - Math.min(1, (lp - dimStart) / (dimEnd - dimStart)) * 0.7 : 1
    if (ambient.current) ambient.current.intensity = 1.1 * dim
    if (rim.current) rim.current.intensity = 0.6 * dim
  })

  return (
    <group position={[0, 0, OFFSET_Z]}>
      <ambientLight ref={ambient} color="#1a2540" intensity={1.1} />
      <directionalLight ref={rim} color="#4ce0e8" intensity={0.6} position={[-6, 6, -8]} />
      <LabEnvironment />
      <HologramCore />
      <LabParticles />
      <LabDrones />
      <LabDoors />
    </group>
  )
}

export default IntroScene