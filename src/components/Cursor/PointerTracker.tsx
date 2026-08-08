import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef } from 'react'
import pointerStore from '@/utils/pointerStore'

const WORLD_DISTANCE = 7

function PointerTracker() {
  const { camera, pointer } = useThree()
  const rayDir = useRef(new THREE.Vector3())

  useFrame(() => {
    pointerStore.x += (pointer.x - pointerStore.x) * 0.06
    pointerStore.y += (pointer.y - pointerStore.y) * 0.06

    rayDir.current
      .set(pointerStore.x, pointerStore.y, 0.5)
      .unproject(camera)
      .sub(camera.position)
      .normalize()

    pointerStore.world.copy(camera.position).addScaledVector(rayDir.current, WORLD_DISTANCE)
  })

  return null
}

export default PointerTracker