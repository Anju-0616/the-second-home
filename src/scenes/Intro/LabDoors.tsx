import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import scrollStore from '@/utils/scrollStore'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
function smooth(t: number) {
  t = Math.min(1, Math.max(0, t))
  return t * t * (3 - 2 * t)
}

function LabDoors() {
  const left = useRef<THREE.Mesh>(null)
  const right = useRef<THREE.Mesh>(null)
  const lightBeyond = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(() => {
    if (scrollStore.activeIndex !== 0) return
    const lp = scrollStore.localProgress
    const doorStart = 0.62
    const doorEnd = 0.88
    const doorP = lp > doorStart ? smooth((lp - doorStart) / (doorEnd - doorStart)) : 0

    if (left.current) left.current.position.x = lerp(-3, -8.5, doorP)
    if (right.current) right.current.position.x = lerp(3, 8.5, doorP)
    if (lightBeyond.current) lightBeyond.current.opacity = doorP * 0.9
  })

  return (
    <>
      <mesh ref={left} position={[-3, 4, -18]}>
        <boxGeometry args={[6, 12, 0.6]} />
        <meshStandardMaterial color="#0d1520" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh ref={right} position={[3, 4, -18]}>
        <boxGeometry args={[6, 12, 0.6]} />
        <meshStandardMaterial color="#0d1520" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 4, -19]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial ref={lightBeyond} color="#ffffff" transparent opacity={0} />
      </mesh>
    </>
  )
}

export default LabDoors