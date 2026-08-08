import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '@/utils/scrollStore'
import { getPhaseRanges } from '@/data/timeline'
import { smooth } from '@/utils/math'

const PHASE_INDEX = getPhaseRanges().findIndex((p) => p.id === 'earth')
const CRACK_COUNT = 34

function randomOnSphere(radius: number) {
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

function EarthCracks() {
  const group = useRef<THREE.Group>(null)

  const cracks = useMemo(() => {
    return Array.from({ length: CRACK_COUNT }, (_, i) => {
      const start = randomOnSphere(4.02)
      const end = start.clone().add(
        new THREE.Vector3((Math.random() - 0.5) * 1.4, (Math.random() - 0.5) * 1.4, (Math.random() - 0.5) * 1.4),
      ).setLength(4.02)
      const mid = start.clone().lerp(end, 0.5).setLength(4.15)
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
      const geometry = new THREE.TubeGeometry(curve, 8, 0.02, 5, false)
      return { geometry, litAt: i / CRACK_COUNT, lavaPos: end }
    })
  }, [])

  useFrame(() => {
    if (scrollStore.activeIndex !== PHASE_INDEX) return
    const lp = scrollStore.localProgress
    const igniteP = smooth((lp - 0.3) / 0.3)

    group.current?.children.forEach((child, i) => {
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
      const on = igniteP > cracks[i].litAt ? 1 : 0
      mat.emissiveIntensity += (on * 2.2 - mat.emissiveIntensity) * 0.08
    })
  })

  return (
    <group ref={group}>
      {cracks.map((c, i) => (
        <mesh key={i} geometry={c.geometry}>
          <meshStandardMaterial color="#1a0a04" emissive="#ff5522" emissiveIntensity={0} />
        </mesh>
      ))}
    </group>
  )
}

export default EarthCracks