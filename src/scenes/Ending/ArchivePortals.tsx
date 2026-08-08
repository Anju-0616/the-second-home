import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '@/utils/scrollStore'
import { getPhaseRanges } from '@/data/timeline'
import { smooth } from '@/utils/math'

const PHASE_INDEX = getPhaseRanges().findIndex((p) => p.id === 'ending')
const COUNT = 50
const dummy = new THREE.Object3D()
const PALETTE = ['#4ce0e8', '#a855f7', '#ec4899', '#e8b64c', '#4ade80']

function ArchivePortals() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const material = useRef<THREE.MeshBasicMaterial>(null)
  const group = useRef<THREE.Group>(null)

  const portals = useMemo(() => {
    const color = new THREE.Color()
    const colors = new Float32Array(COUNT * 3)
    const data = Array.from({ length: COUNT }, (_, i) => {
      const radius = 18 + Math.random() * 45
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      color.set(PALETTE[i % PALETTE.length])
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
      return {
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi) * 0.6,
          radius * Math.sin(phi) * Math.sin(theta),
        ),
        scale: 0.6 + Math.random() * 1.6,
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      }
    })
    return { data, colors }
  }, [])

  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.008

    if (mesh.current) {
      portals.data.forEach((p, i) => {
        dummy.position.copy(p.position)
        dummy.rotation.copy(p.rotation)
        dummy.scale.setScalar(p.scale)
        dummy.updateMatrix()
        mesh.current!.setMatrixAt(i, dummy.matrix)
      })
      mesh.current.instanceMatrix.needsUpdate = true
    }

    if (scrollStore.activeIndex !== PHASE_INDEX) return
    const lp = scrollStore.localProgress
    const fadeIn = smooth((lp - 0.15) / 0.4)
    if (material.current) material.current.opacity = fadeIn * 0.7
  })

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
        <torusGeometry args={[1, 0.06, 8, 40]} />
        <meshBasicMaterial ref={material} transparent opacity={0} vertexColors />
        <instancedBufferAttribute attach="instanceColor" args={[portals.colors, 3]} />
      </instancedMesh>
    </group>
  )
}

export default ArchivePortals