import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { fakeNoise3 } from '@/utils/proceduralNoise'
import Waterfall from './Waterfall'
import CrystalSpire from '@/components/Civilization/CrystalSpire'

export interface IslandConfig {
  position: [number, number, number]
  radius: number
  rockColor: string
  vegetationColor: string
  seed: number
  hasCivilization?: boolean
  civColor?: string
  bobSpeed?: number
}

const dummy = new THREE.Object3D()

function buildIslandGeometry(radius: number, seed: number) {
  const geo = new THREE.IcosahedronGeometry(radius, 3)
  const posAttr = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < posAttr.count; i++) {
    v.fromBufferAttribute(posAttr, i)
    const n = fakeNoise3(v.x * 0.5, v.y * 0.5, v.z * 0.5, seed)
    v.normalize().multiplyScalar(radius + n * radius * 0.1)
    posAttr.setXYZ(i, v.x, v.y * 0.45, v.z) // squash into an island silhouette
  }
  geo.computeVertexNormals()
  return geo
}

function FloatingIsland({ config }: { config: IslandConfig }) {
  const {
    position,
    radius,
    rockColor,
    vegetationColor,
    seed,
    hasCivilization = false,
    civColor = '#a855f7',
    bobSpeed = 0.3,
  } = config

  const group = useRef<THREE.Group>(null)
  const trees = useRef<THREE.InstancedMesh>(null)
  const geometry = useMemo(() => buildIslandGeometry(radius, seed), [radius, seed])

  const treeSpots = useMemo(() => {
    const rand = (n: number) => Math.sin(n * 12.9898 + seed) * 43758.5453 % 1
    return Array.from({ length: 14 }, (_, i) => {
      const a = rand(i) * Math.PI * 2
      const r = Math.abs(rand(i + 50)) * radius * 0.75
      return new THREE.Vector3(Math.cos(a) * r, radius * 0.35, Math.sin(a) * r)
    })
  }, [radius, seed])

  useFrame((state) => {
    if (!group.current) return
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * bobSpeed + seed) * 0.4

    if (trees.current) {
      treeSpots.forEach((p, i) => {
        dummy.position.copy(p)
        dummy.scale.setScalar(0.5 + (i % 3) * 0.15)
        dummy.updateMatrix()
        trees.current!.setMatrixAt(i, dummy.matrix)
      })
      trees.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={group} position={[position[0], position[1], position[2]]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={rockColor} roughness={0.9} metalness={0.05} />
      </mesh>

      <instancedMesh ref={trees} args={[undefined, undefined, treeSpots.length]}>
        <coneGeometry args={[0.18, 0.6, 6]} />
        <meshStandardMaterial color="#0e2418" emissive={vegetationColor} emissiveIntensity={0.6} />
      </instancedMesh>

      <Waterfall origin={[radius * 0.6, -radius * 0.3, 0]} color={vegetationColor} />
      <Waterfall origin={[-radius * 0.5, -radius * 0.3, radius * 0.3]} color={vegetationColor} />

      {hasCivilization && (
        <>
          <CrystalSpire position={[0.6, radius * 0.4, 0.4]} color={civColor} scale={1.1} />
          <CrystalSpire position={[-0.8, radius * 0.35, -0.5]} color={civColor} scale={0.8} />
        </>
      )}
    </group>
  )
}

export default FloatingIsland