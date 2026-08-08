import { useProgress } from '@react-three/drei'

function Loader() {
  const { progress, active } = useProgress()

  if (!active) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void">
      <div className="font-display text-xs tracking-[0.35em] uppercase text-cyan/70 mb-4">
        The Second Home
      </div>
      <div className="w-48 h-[1.5px] bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan to-purple transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default Loader