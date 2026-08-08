import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import pointerStore from '@/utils/pointerStore'

const COUNT = 1800

function DeepStars() {
  const group = useRef<THREE.Group>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 220
      arr[i * 3 + 1] = (Math.random() - 0.5) * 150
      arr[i * 3 + 2] = 20 - Math.random() * 260
    }
    return arr
  }, [])

  useFrame(() => {
    if (!group.current) return
    group.current.position.x += (-pointerStore.x * 1.5 - group.current.position.x) * 0.03
    group.current.position.y += (-pointerStore.y * 1.0 - group.current.position.y) * 0.03
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#dff6ff" size={0.11} transparent opacity={0.85} />
      </points>
    </group>
  )
}

export default DeepStars