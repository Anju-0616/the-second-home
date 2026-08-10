import { useFrame, useThree } from '@react-three/fiber'
import scrollStore from '@/utils/scrollStore'
import { getPhaseRanges } from '@/data/timeline'

const ranges = getPhaseRanges()
const DEFAULT_EXPOSURE = 1.2

function GlobalExposure() {
  const { gl } = useThree()

  useFrame(() => {
    const target = ranges[scrollStore.activeIndex]?.exposure ?? DEFAULT_EXPOSURE
    gl.toneMappingExposure += (target - gl.toneMappingExposure) * 0.05
  })

  return null
}

export default GlobalExposure