import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'
import pointerStore from '@/utils/pointerStore'
import { getProceduralRoughnessMap } from '@/utils/proceduralTexture'
import '@/shaders/HologramCoreMaterial'
import '@/shaders/EnergyFieldMaterial'
import type { HologramCoreMaterialInstance } from '@/shaders/HologramCoreMaterial'
import type { EnergyFieldMaterialInstance } from '@/shaders/EnergyFieldMaterial'

function HologramCore() {
  const core = useRef<THREE.Group>(null)
  const coreMat = useRef<HologramCoreMaterialInstance>(null)
  const fieldA = useRef<EnergyFieldMaterialInstance>(null)
  const fieldB = useRef<EnergyFieldMaterialInstance>(null)
  const light = useRef<THREE.PointLight>(null)
  const roughnessMap = getProceduralRoughnessMap()

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (!core.current) return

    core.current.rotation.y += dt * 0.1
    core.current.rotation.x += (pointerStore.y * 0.15 - core.current.rotation.x) * 0.04
    core.current.rotation.z += (-pointerStore.x * 0.1 - core.current.rotation.z) * 0.04

    if (coreMat.current) coreMat.current.uTime = t
    if (fieldA.current) fieldA.current.uTime = t
    if (fieldB.current) fieldB.current.uTime = t * 0.8
    if (light.current) light.current.intensity = 3.0 + Math.sin(t * 1.3) * 0.6
  })

  return (
    <group position={[0, 1.2, 0]}>
      {/* pedestal — solid, physical, picks up HDRI reflections + procedural roughness */}
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.9, 1.05, 0.25, 32]} />
        <meshStandardMaterial color="#0a1018" roughnessMap={roughnessMap} roughness={0.5} metalness={0.75} />
      </mesh>
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.06, 32]} />
        <meshStandardMaterial color="#0d1a22" emissive="#4ce0e8" emissiveIntensity={0.6} metalness={0.6} roughness={0.4} />
      </mesh>

      <group ref={core}>
        <pointLight ref={light} color="#9fFFFb" intensity={3} distance={12} decay={2} />

        {/* volumetric energy core — smooth high-poly sphere, shader-driven, no polygon silhouette */}
        <mesh>
          <sphereGeometry args={[0.85, 96, 96]} />
          <hologramCoreMaterial
            ref={coreMat}
            uColor={new THREE.Color('#4ce0e8')}
            uColorCore={new THREE.Color('#eafeff')}
            uIntensity={1}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* soft layered energy field — camera-facing gradient discs, replaces ring/torus geometry */}
        <Billboard>
          <mesh scale={2.1}>
            <circleGeometry args={[1, 48]} />
            <energyFieldMaterial
              ref={fieldA}
              uColor={new THREE.Color('#4ce0e8')}
              uOpacity={0.5}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </Billboard>
        <Billboard>
          <mesh scale={2.7} rotation={[0, 0, Math.PI / 5]}>
            <circleGeometry args={[1, 48]} />
            <energyFieldMaterial
              ref={fieldB}
              uColor={new THREE.Color('#9fFFFb')}
              uOpacity={0.3}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </Billboard>
      </group>
    </group>
  )
}

export default HologramCore