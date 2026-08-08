import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import pointerStore from '@/utils/pointerStore'

export interface StarFieldProps {
  count?: number
  spreadX?: number
  spreadY?: number
  zFront?: number
  zSpread?: number
  size?: number
  opacity?: number
  parallax?: number
}

function StarField({
  count = 1000,
  spreadX = 100,
  spreadY = 70,
  zFront = 20,
  zSpread = 200,
  size = 0.1,
  opacity = 0.8,
  parallax = 1.2,
}: StarFieldProps) {
  const group = useRef<THREE.Group>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spreadX
      arr[i * 3 + 1] = (Math.random() - 0.5) * spreadY
      arr[i * 3 + 2] = zFront - Math.random() * zSpread
    }
    return arr
  }, [count, spreadX, spreadY, zFront, zSpread])

  useFrame(() => {
    if (!group.current) return
    group.current.position.x += (-pointerStore.x * parallax - group.current.position.x) * 0.03
    group.current.position.y += (-pointerStore.y * parallax * 0.7 - group.current.position.y) * 0.03
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#dff6ff" size={size} transparent opacity={opacity} />
      </points>
    </group>
  )
}

export default StarField