import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import scrollStore from '@/utils/scrollStore'

/** Hides a phase's entire group when it isn't the active phase, so inactive
 * phases can't visually bleed into another phase's camera shot and aren't
 * needlessly rendered every frame. */
export function usePhaseVisibility(phaseIndex: number) {
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.visible = scrollStore.activeIndex === phaseIndex
    }
  })

  return ref
}