import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import scrollStore from '@/utils/scrollStore'
import { getPhaseRanges } from '@/data/timeline'
import { smooth } from '@/utils/math'
import '@/shaders/EarthMaterial'
import type { EarthMaterialInstance } from '@/shaders/EarthMaterial'

const PHASE_INDEX = getPhaseRanges().findIndex((p) => p.id === 'earth')

// Earth textures: Solar System Scope (solarsystemscope.com/textures), CC BY 4.0

function EarthGlobe() {
  const body = useRef<THREE.Mesh>(null)
  const earthMat = useRef<EarthMaterialInstance>(null)

  const [dayMap, nightMap, cloudsMap] = useTexture(
  ['/textures/earth/day.jpg', '/textures/earth/night.jpg', '/textures/earth/clouds.jpg'],
  (textures) => {
    textures[0].colorSpace = THREE.SRGBColorSpace
    textures[1].colorSpace = THREE.SRGBColorSpace
  },
)

  useFrame((_, dt) => {
    if (body.current) body.current.rotation.y += dt * 0.04

    if (scrollStore.activeIndex !== PHASE_INDEX) return
    const lp = scrollStore.localProgress
    const heat = smooth((lp - 0.35) / 0.35)

    if (earthMat.current) {
      earthMat.current.uAtmosphereColor.setHex(0x4ce0e8).lerp(new THREE.Color(0xff5522), heat)
      earthMat.current.uCloudOpacity = 0.6 * (1 - smooth((lp - 0.6) / 0.3))
    }
  })

  return (
    <mesh ref={body}>
      <sphereGeometry args={[4, 64, 64]} />
      <earthMaterial
        ref={earthMat}
        uDayMap={dayMap}
        uNightMap={nightMap}
        uCloudsMap={cloudsMap}
        uSunDirection={new THREE.Vector3(1, 0.3, 0.5)}
        uAtmosphereColor={new THREE.Color('#4ce0e8')}
        uCloudOpacity={0.6}
      />
    </mesh>
  )
}

export default EarthGlobe