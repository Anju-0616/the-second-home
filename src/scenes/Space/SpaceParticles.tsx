import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import pointerStore from '@/utils/pointerStore'

const COUNT = 300

function SpaceParticles() {
  const points = useRef<THREE.Points>(null)

  const { positions, base } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const base = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 24
      const y = (Math.random() - 0.5) * 16
      const z = 10 - Math.random() * 120
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      base[i * 3] = x
      base[i * 3 + 1] = y
      base[i * 3 + 2] = z
    }
    return { positions, base }
  }, [])

  useFrame(() => {
    const attr = points.current?.geometry.attributes.position as THREE.BufferAttribute | undefined
    if (!attr) return
    const mw = pointerStore.world

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      const iy = i * 3 + 1
      const iz = i * 3 + 2
      let px = attr.array[ix] as number
      let py = attr.array[iy] as number
      const pz = attr.array[iz] as number

      const dx = px - mw.x
      const dy = py - mw.y
      const dSq = dx * dx + dy * dy

      if (dSq < 6) {
        const d = Math.sqrt(dSq) + 0.001
        const f = (1 - d / 2.4) * 0.03
        px += (dx / d) * f
        py += (dy / d) * f
      } else {
        px += (base[ix] - px) * 0.02
        py += (base[iy] - py) * 0.02
      }

      attr.array[ix] = px
      attr.array[iy] = py
      attr.array[iz] = pz
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#9fFFFb"
        size={0.06}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default SpaceParticles