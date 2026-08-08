import { useEndingFinale } from '@/hooks/useEndingFinale'

function EndingFinale() {
  const text = useEndingFinale()

  return (
    <div className="fixed inset-0 z-25 flex items-center justify-center pointer-events-none px-8">
      <div
        className="font-display text-center transition-opacity duration-1000 ease-out"
        style={{
          opacity: text ? 1 : 0,
          fontSize: 'clamp(1.6rem, 4.2vw, 3.2rem)',
          fontWeight: 500,
          letterSpacing: '0.04em',
          color: '#f5faff',
          textShadow: '0 0 30px rgba(76,224,232,0.5), 0 0 90px rgba(168,85,247,0.35)',
        }}
      >
        {text}
      </div>
    </div>
  )
}

export default EndingFinale