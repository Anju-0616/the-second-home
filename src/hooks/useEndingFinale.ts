import { useEffect, useState } from 'react'
import scrollStore from '@/utils/scrollStore'
import { getPhaseRanges } from '@/data/timeline'

const PHASE_INDEX = getPhaseRanges().findIndex((p) => p.id === 'ending')

const STAGES = [
  { text: 'This was only the beginning.', range: [0.55, 0.75] as [number, number] },
  { text: 'More worlds await.', range: [0.78, 0.92] as [number, number] },
  { text: 'To Be Continued...', range: [0.94, 1.01] as [number, number] },
]

export function useEndingFinale() {
  const [text, setText] = useState('')

  useEffect(() => {
    let raf: number
    const tick = () => {
      let desired = ''
      if (scrollStore.activeIndex === PHASE_INDEX) {
        const lp = scrollStore.localProgress
        for (const s of STAGES) {
          if (lp > s.range[0] && lp < s.range[1]) {
            desired = s.text
            break
          }
        }
      }
      setText((prev) => (prev === desired ? prev : desired))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return text
}