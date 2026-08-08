import { useEffect, useState, useRef } from 'react'
import scrollStore from '@/utils/scrollStore'
import { getPhaseRanges } from '@/data/timeline'

const ranges = getPhaseRanges()

export function useActivePhase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [globalProgress, setGlobalProgress] = useState(0)
  const lastIndex = useRef(0)
  const rafId = useRef<number>(0)

  useEffect(() => {
    const tick = () => {
      if (scrollStore.activeIndex !== lastIndex.current) {
        lastIndex.current = scrollStore.activeIndex
        setActiveIndex(scrollStore.activeIndex)
      }
      // progress bar still wants smooth updates — cheap since it's one div's height
      setGlobalProgress(scrollStore.global)
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [])

  return { activePhase: ranges[activeIndex], activeIndex, globalProgress }
}