import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { fakeNoise3 } from '@/utils/proceduralNoise'

export interface PlanetConfig {
  name: string
  position: [number, number, number]
  radius: number
  color: string
  emissive: string
  atmosphereColor: string
  lightColor: string
  seed: number
  rotationSpeed?: number
  hasRing?: boolean
  ringColor?: string
}

function buildTerrainGeometry(radius: number, seed: number) {
  const geo = new THREE.IcosahedronGeometry(radius, 4)
  const posAttr = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < posAttr.count; i++) {
    v.fromBufferAttribute(posAttr, i)
    const n = fakeNoise3(v.x * 0.4, v.y * 0.4, v.z * 0.4, seed)
    v.normalize().multiplyScalar(radius + n * radius * 0.06)
    posAttr.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  return geo
}

function Planet({ config }: { config: PlanetConfig }) {
  const {
    name,
    position,
    radius,
    color,
    emissive,
    atmosphereColor,
    lightColor,
    seed,
    rotationSpeed = 0.02,
    hasRing = false,
    ringColor = '#ffffff',
  } = config

  const body = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => buildTerrainGeometry(radius, seed), [radius, seed])

  useFrame((_, dt) => {
    if (body.current) body.current.rotation.y += dt * rotationSpeed
  })

  return (
    <group position={position}>
      <pointLight color={lightColor} intensity={1.6} distance={radius * 6} decay={2} />

      <mesh ref={body} geometry={geometry}>
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.35}
          roughness={0.75}
          metalness={0.1}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[radius * 1.12, 32, 32]} />
        <meshBasicMaterial color={atmosphereColor} transparent opacity={0.18} side={THREE.BackSide} />
      </mesh>

      {hasRing && (
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[radius * 1.8, 0.15, 8, 80]} />
          <meshBasicMaterial color={ringColor} transparent opacity={0.6} />
        </mesh>
      )}

      <Html position={[0, radius * 1.4, 0]} center distanceFactor={20}>
        <div className="font-display text-[10px] tracking-[0.3em] uppercase text-white/70 whitespace-nowrap pointer-events-none">
          {name}
        </div>
      </Html>
    </group>
  )
}

export default Planet