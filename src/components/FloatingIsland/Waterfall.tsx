import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface WaterfallProps {
  origin: [number, number, number]
  dropHeight?: number
  spread?: number
  color?: string
  count?: number
}

function Waterfall({ origin, dropHeight = 14, spread = 0.6, color = '#9fFFFb', count = 120 }: WaterfallProps) {
  const points = useRef<THREE.Points>(null)

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = origin[0] + (Math.random() - 0.5) * spread
      positions[i * 3 + 1] = origin[1] - Math.random() * dropHeight
      positions[i * 3 + 2] = origin[2] + (Math.random() - 0.5) * spread
      speeds[i] = 3 + Math.random() * 2
    }
    return { positions, speeds }
  }, [origin, spread, dropHeight, count])

  useFrame((_, dt) => {
    const attr = points.current?.geometry.attributes.position as THREE.BufferAttribute | undefined
    if (!attr) return
    for (let i = 0; i < count; i++) {
      const iy = i * 3 + 1
      let y = attr.array[iy] as number
      y -= dt * speeds[i]
      if (y < origin[1] - dropHeight) y = origin[1]
      attr.array[iy] = y
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.05}
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default Waterfall