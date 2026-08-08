import { useMemo } from 'react'
import * as THREE from 'three'

const CLUSTER_COUNT = 5
const POINTS_PER_CLUSTER = 6

function ConstellationLines() {
  const clusters = useMemo(() => {
    return Array.from({ length: CLUSTER_COUNT }, () => {
      const center = new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 30,
        -30 - Math.random() * 90,
      )
      const points: THREE.Vector3[] = []
      for (let i = 0; i < POINTS_PER_CLUSTER; i++) {
        points.push(
          center
            .clone()
            .add(new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 2)),
        )
      }
      const linePoints = points.slice(0, -1).flatMap((p, i) => [p, points[i + 1]])
      const lineGeom = new THREE.BufferGeometry().setFromPoints(linePoints)
      return { points, lineGeom }
    })
  }, [])

  return (
    <group>
      {clusters.map((c, ci) => (
        <group key={ci}>
          <lineSegments geometry={c.lineGeom}>
            <lineBasicMaterial color="#4ce0e8" transparent opacity={0.25} />
          </lineSegments>
          {c.points.map((p, pi) => (
            <mesh key={pi} position={p}>
              <sphereGeometry args={[0.06, 6, 6]} />
              <meshBasicMaterial color="#dff6ff" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export default ConstellationLines