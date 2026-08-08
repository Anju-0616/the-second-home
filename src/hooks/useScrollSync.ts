import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import scrollStore from '@/utils/scrollStore'
import { getPhaseRanges } from '@/data/timeline'

gsap.registerPlugin(ScrollTrigger)

/**
 * Ties the real scroll container's height to GSAP's ScrollTrigger and keeps
 * `scrollStore` updated every scroll tick. Call this once, near the app root.
 */
export function useScrollSync(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    
    if (!containerRef.current) return

    const ranges = getPhaseRanges()

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollStore.global = self.progress

        const idx = ranges.findIndex(
          (r) => self.progress >= r.start && self.progress < r.end,
        )
        const activeIndex = idx === -1 ? ranges.length - 1 : idx
        const range = ranges[activeIndex]

        scrollStore.activeIndex = activeIndex
        scrollStore.localProgress = Math.min(
          1,
          Math.max(0, (self.progress - range.start) / (range.end - range.start)),
        )
      },
    })

    return () => trigger.kill()
  }, [containerRef])
}