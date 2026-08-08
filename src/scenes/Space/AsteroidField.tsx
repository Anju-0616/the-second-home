import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 40
const dummy = new THREE.Object3D()

interface AsteroidData {
  position: THREE.Vector3
  scale: number
  spinAxis: THREE.Vector3
  spinSpeed: number
  rotation: THREE.Euler
}

function AsteroidField() {
  const mesh = useRef<THREE.InstancedMesh>(null)

  const asteroids = useMemo<AsteroidData[]>(
    () =>
      Array.from({ length: COUNT }, () => ({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 16,
          -20 - Math.random() * 35,
        ),
        scale: 0.25 + Math.random() * 0.7,
        spinAxis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
        spinSpeed: (Math.random() - 0.5) * 0.6,
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      })),
    [],
  )

  useFrame((_, dt) => {
    if (!mesh.current) return
    asteroids.forEach((a, i) => {
      a.rotation.x += dt * a.spinSpeed
      a.rotation.y += dt * a.spinSpeed * 0.7
      dummy.position.copy(a.position)
      dummy.rotation.copy(a.rotation)
      dummy.scale.setScalar(a.scale)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#554e4a" roughness={0.95} metalness={0.05} />
    </instancedMesh>
  )
}

export default AsteroidField