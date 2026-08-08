import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '@/utils/scrollStore'
import { getPhaseRanges } from '@/data/timeline'
import { clamp01 } from '@/utils/math'

const PHASE_INDEX = getPhaseRanges().findIndex((p) => p.id === 'earth')
const COUNT = 500
const MAX_RADIUS = 7

function EarthExplosion() {
  const points = useRef<THREE.Points>(null)
  const material = useRef<THREE.PointsMaterial>(null)

  const { positions, directions } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const directions: THREE.Vector3[] = []
    for (let i = 0; i < COUNT; i++) {
      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      ).normalize()
      directions.push(dir)
    }
    return { positions, directions }
  }, [])

  useFrame(() => {
    if (scrollStore.activeIndex !== PHASE_INDEX) return
    const lp = scrollStore.localProgress
    const t = clamp01((lp - 0.78) / 0.22)
    const radius = t * MAX_RADIUS
    const opacity = Math.sin(t * Math.PI) * 0.9

    const attr = points.current?.geometry.attributes.position as THREE.BufferAttribute | undefined
    if (attr) {
      for (let i = 0; i < COUNT; i++) {
        const d = directions[i]
        const jitter = 1 + Math.sin(i * 12.9) * 0.15
        attr.array[i * 3] = d.x * radius * jitter
        attr.array[i * 3 + 1] = d.y * radius * jitter
        attr.array[i * 3 + 2] = d.z * radius * jitter
      }
      attr.needsUpdate = true
    }
    if (material.current) material.current.opacity = opacity
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        color="#ff8844"
        size={0.18}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default EarthExplosion