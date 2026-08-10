import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '@/utils/scrollStore'
import '@/shaders/LightBeamMaterial'
import type { LightBeamMaterialInstance } from '@/shaders/LightBeamMaterial'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
function smooth(t: number) {
  t = Math.min(1, Math.max(0, t))
  return t * t * (3 - 2 * t)
}

function LabDoors() {
  const left = useRef<THREE.Group>(null)
  const right = useRef<THREE.Group>(null)
  const beamCore = useRef<LightBeamMaterialInstance>(null)
  const beamHalo = useRef<LightBeamMaterialInstance>(null)

  useFrame((state) => {
    if (beamCore.current) beamCore.current.uTime = state.clock.elapsedTime
    if (beamHalo.current) beamHalo.current.uTime = state.clock.elapsedTime * 0.7

    if (scrollStore.activeIndex !== 0) return
    const lp = scrollStore.localProgress
    const doorStart = 0.62
    const doorEnd = 0.88
    const doorP = lp > doorStart ? smooth((lp - doorStart) / (doorEnd - doorStart)) : 0

    if (left.current) left.current.position.x = lerp(-3, -8.5, doorP)
    if (right.current) right.current.position.x = lerp(3, 8.5, doorP)
    if (beamCore.current) beamCore.current.uOpacity = doorP * 0.85
    if (beamHalo.current) beamHalo.current.uOpacity = doorP * 0.35
  })

  const doorLeaf = (
    <>
      <mesh>
        <boxGeometry args={[6, 12, 0.6]} />
        <meshStandardMaterial color="#0d1520" metalness={0.85} roughness={0.3} />
      </mesh>
      {[-3.5, 0, 3.5].map((y) => (
        <mesh key={y} position={[0, y, 0.31]}>
          <boxGeometry args={[5.6, 0.04, 0.02]} />
          <meshStandardMaterial color="#0d1a22" emissive="#4ce0e8" emissiveIntensity={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.31]}>
        <boxGeometry args={[0.04, 11.6, 0.02]} />
        <meshStandardMaterial color="#0d1a22" emissive="#4ce0e8" emissiveIntensity={0.7} />
      </mesh>
    </>
  )

  return (
    <>
      <group ref={left} position={[-3, 4, -18]}>
        {doorLeaf}
      </group>
      <group ref={right} position={[3, 4, -18]}>
        {doorLeaf}
      </group>

      <mesh position={[0, 4, -18.4]}>
        <boxGeometry args={[13, 13, 0.3]} />
        <meshStandardMaterial color="#050a10" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 4, -18.2]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* layered soft light shaft — same shader technique as the lab beam */}
      <mesh position={[0, 4, -19]}>
        <planeGeometry args={[2, 12]} />
        <lightBeamMaterial
          ref={beamCore}
          uColor={new THREE.Color('#fffaf0')}
          uOpacity={0}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0, 4, -19.1]}>
        <planeGeometry args={[9, 13]} />
        <lightBeamMaterial
          ref={beamHalo}
          uColor={new THREE.Color('#bfe8ff')}
          uOpacity={0}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  )
}

export default LabDoors