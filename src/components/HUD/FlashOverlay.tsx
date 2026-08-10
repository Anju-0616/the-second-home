import { useEffect, useRef } from 'react'
import scrollStore from '@/utils/scrollStore'
import { getPhaseRanges } from '@/data/timeline'
import { clamp01 } from '@/utils/math'

const ranges = getPhaseRanges()

function FlashOverlay() {
  const el = useRef<HTMLDivElement>(null)
  const MAX_FLASH_OPACITY = 0.03

  useEffect(() => {
    let raf: number
    const tick = () => {
      const range = ranges[scrollStore.activeIndex]
      let opacity = 0
      if (range?.flash) {
        const { threshold } = range.flash
        opacity = clamp01((scrollStore.localProgress - threshold) / (1 - threshold)) * MAX_FLASH_OPACITY
      }
      if (el.current) {
        el.current.style.opacity = String(opacity)
        el.current.style.background = range?.flash?.color ?? '#fff'
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={el}
      className="fixed inset-0 z-40 pointer-events-none"
      style={{ opacity: 0, transition: 'opacity 0.05s linear' }}
    />
  )
}

export default FlashOverlay