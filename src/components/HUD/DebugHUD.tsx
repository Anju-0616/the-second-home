import { useActivePhase } from '@/hooks/useActivePhase'
import scrollStore from '@/utils/scrollStore'
import { useState, useEffect } from 'react'

function DebugHUD() {
  const { activePhase } = useActivePhase()
  const [local, setLocal] = useState(0)

  useEffect(() => {
    let raf: number
    const tick = () => {
      setLocal(scrollStore.localProgress)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 font-display text-xs tracking-[0.3em] uppercase text-cyan/80 text-center">
      {activePhase.name}
      <div className="text-white/40 mt-1 text-[0.65rem] tracking-normal normal-case">
        local progress: {local.toFixed(2)}
      </div>
    </div>
  )
}

export default DebugHUD