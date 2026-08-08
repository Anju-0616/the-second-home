import * as THREE from 'three'

export interface PointerState {
  x: number // smoothed, -1..1
  y: number
  world: THREE.Vector3
}

const pointerStore: PointerState = {
  x: 0,
  y: 0,
  world: new THREE.Vector3(),
}

export default pointerStore