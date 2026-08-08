import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 400

function BioMotes() {
  const points = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40
      arr[i * 3 + 1] = -14 + Math.random() * 24
      arr[i * 3 + 2] = 10 - Math.random() * 90
    }
    return arr
  }, [])

  useFrame((_, dt) => {
    const attr = points.current?.geometry.attributes.position as THREE.BufferAttribute | undefined
    if (!attr) return
    for (let i = 0; i < COUNT; i++) {
      const iy = i * 3 + 1
      let y = attr.array[iy] as number
      y += dt * 0.25
      if (y > 10) y = -14
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
        color="#7dffcf"
        size={0.05}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default BioMotes