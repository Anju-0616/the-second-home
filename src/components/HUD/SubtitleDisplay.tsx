import { useSubtitle } from '@/hooks/useSubtitle'

function SubtitleDisplay() {
  const text = useSubtitle()

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none px-8">
      <div
        className="font-display text-center max-w-3xl transition-opacity duration-700 ease-out"
        style={{
          opacity: text ? 1 : 0,
          fontSize: 'clamp(1.15rem, 2.8vw, 2.2rem)',
          fontWeight: 500,
          letterSpacing: '0.02em',
          color: '#eafcff',
          textShadow: '0 0 20px rgba(76,224,232,0.6), 0 0 60px rgba(168,85,247,0.3)',
        }}
      >
        {text}
      </div>
    </div>
  )
}

export default SubtitleDisplay