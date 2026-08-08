import { useActivePhase } from '@/hooks/useActivePhase'

function ProgressBar() {
  const { globalProgress } = useActivePhase()

  return (
    <div className="fixed left-10 top-1/2 -translate-y-1/2 w-[1.5px] h-40 bg-white/10 overflow-hidden z-30">
      <div
        className="w-full bg-gradient-to-b from-cyan to-purple"
        style={{ height: `${globalProgress * 100}%` }}
      />
    </div>
  )
}

export default ProgressBar