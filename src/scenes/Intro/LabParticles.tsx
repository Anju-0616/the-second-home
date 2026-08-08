import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import pointerStore from '@/utils/pointerStore'

const COUNT = 400

function LabParticles() {
  const points = useRef<THREE.Points>(null)

  const { positions, base } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const base = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = Math.random() * 9 - 1.4
      const z = (Math.random() - 0.5) * 20 - 6
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      base[i * 3] = x
      base[i * 3 + 1] = y
      base[i * 3 + 2] = z
    }
    return { positions, base }
  }, [])

  useFrame((_, dt) => {
    const attr = points.current?.geometry.attributes.position as
      | THREE.BufferAttribute
      | undefined
    if (!attr) return
    const mw = pointerStore.world

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      const iy = i * 3 + 1
      const iz = i * 3 + 2
      let px = attr.array[ix] as number
      let py = attr.array[iy] as number
      let pz = attr.array[iz] as number

      py += dt * 0.15
      if (py > 8.5) py = -1.4

      const dx = px - mw.x
      const dz = pz - mw.z
      const dSq = dx * dx + dz * dz

      if (dSq < 9) {
        const d = Math.sqrt(dSq) + 0.001
        const f = (1 - d / 3) * 0.02
        px += (-dz / d) * f
        pz += (dx / d) * f
      } else {
        px += (base[ix] - px) * 0.01
        pz += (base[iz] - pz) * 0.01
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
        <bufferAttribute
  attach="attributes-position"
  args={[positions, 3]}
/>
      </bufferGeometry>
      <pointsMaterial
        color="#8fe8ff"
        size={0.05}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default LabParticles