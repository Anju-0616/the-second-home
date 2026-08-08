import { useEffect, useRef, useState } from 'react'
import scrollStore from '@/utils/scrollStore'
import { getPhaseRanges } from '@/data/timeline'

const ranges = getPhaseRanges()

export function useSubtitle() {
  const [text, setText] = useState('')
  const lastText = useRef('')

  useEffect(() => {
    let raf: number
    const tick = () => {
      const range = ranges[scrollStore.activeIndex]
      const lp = scrollStore.localProgress
      let desired = ''
      if (range?.subtitles) {
        for (const s of range.subtitles) {
          if (lp > s.range[0] && lp < s.range[1]) {
            desired = s.text
            break
          }
        }
      }
      if (desired !== lastText.current) {
        lastText.current = desired
        setText(desired)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return text
}