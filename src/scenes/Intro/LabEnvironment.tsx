import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getProceduralRoughnessMap } from '@/utils/proceduralTexture'
import '@/shaders/LightBeamMaterial'
import type { LightBeamMaterialInstance } from '@/shaders/LightBeamMaterial'

function LabEnvironment() {
  const beamMat = useRef<LightBeamMaterialInstance>(null)
  const roughnessMap = getProceduralRoughnessMap()

  useFrame((state) => {
    if (beamMat.current) beamMat.current.uTime = state.clock.elapsedTime
  })

  return (
    <>
      <gridHelper args={[40, 40, 0x1c3a4a, 0x0a1520]} position={[0, -1.4, 0]} />
      <mesh position={[0, -1.39, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[9, 48]} />
        <meshStandardMaterial
          color="#0b1622"
          roughnessMap={roughnessMap}
          roughness={0.25}
          metalness={0.75}
          transparent
          opacity={0.6}
        />
      </mesh>

      <mesh position={[0, 4, -24]}>
        <planeGeometry args={[40, 14]} />
        <meshStandardMaterial color="#060a12" roughnessMap={roughnessMap} metalness={0.55} roughness={0.6} />
      </mesh>

      {[-9, 9].map((x) => (
        <group key={x} position={[x, 2, -12]}>
          <mesh>
            <boxGeometry args={[0.6, 9, 0.6]} />
            <meshStandardMaterial color="#0a1018" roughnessMap={roughnessMap} metalness={0.65} roughness={0.45} />
          </mesh>
          <mesh position={[x > 0 ? -0.32 : 0.32, 0, 0]}>
            <boxGeometry args={[0.03, 8.4, 0.03]} />
            <meshStandardMaterial color="#0d1a22" emissive="#4ce0e8" emissiveIntensity={0.9} />
          </mesh>
        </group>
      ))}

      {/* soft volumetric-looking light shaft — shader gradient, no cone geometry/edge */}
      <mesh position={[0, 5, 0]}>
        <planeGeometry args={[3.5, 9]} />
        <lightBeamMaterial
          ref={beamMat}
          uColor={new THREE.Color('#bfe8ff')}
          uOpacity={0.14}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3.5, 9]} />
        <lightBeamMaterial
          uColor={new THREE.Color('#bfe8ff')}
          uOpacity={0.1}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  )
}

export default LabEnvironment