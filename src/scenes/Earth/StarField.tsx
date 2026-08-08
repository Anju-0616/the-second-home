import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import pointerStore from '@/utils/pointerStore'

const COUNT = 700

function StarField() {
  const group = useRef<THREE.Group>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 90
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60
      arr[i * 3 + 2] = (Math.random() - 0.5) * 90 - 10
    }
    return arr
  }, [])

  useFrame(() => {
    if (!group.current) return
    // gentle parallax — the whole field drifts opposite the cursor
    group.current.position.x += (-pointerStore.x * 1.2 - group.current.position.x) * 0.03
    group.current.position.y += (-pointerStore.y * 0.8 - group.current.position.y) * 0.03
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#dff6ff" size={0.09} transparent opacity={0.75} />
      </points>
    </group>
  )
}

export default StarField