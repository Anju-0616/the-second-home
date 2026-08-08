import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Loader from '@/components/Loader/loader'
import ProgressBar from '@/components/HUD/ProgressBar'
import DebugHUD from '@/components/HUD/DebugHUD'
import FlashOverlay from '@/components/HUD/FlashOverlay'
import PointerTracker from '@/components/Cursor/PointerTracker'
import IntroScene from '@/scenes/Intro/IntroScene'
import EarthScene from '@/scenes/Earth/EarthScene'
import SpaceScene from '@/scenes/Space/SpaceScene'
import PlanetOneScene from '@/scenes/PlanetOne/PlanetOneScene'
import { useScrollSync } from '@/hooks/useScrollSync'
import { TOTAL_VH } from '@/data/timeline'

function App() {
  const scrollRef = useRef<HTMLDivElement>(null)
  useScrollSync(scrollRef)

  return (
    <>
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 1.6, 14], fov: 56, near: 0.1, far: 400 }} gl={{ antialias: true }}>
          <color attach="background" args={['#050810']} />
          <fogExp2 attach="fog" args={['#050810', 0.02]} />
          <Suspense fallback={null}>
            <PointerTracker />
            <IntroScene />
            <EarthScene />
            <SpaceScene />
            <PlanetOneScene />
          </Suspense>
        </Canvas>
      </div>

      <div
        className="relative z-10 pointer-events-none"
        ref={scrollRef}
        style={{ height: `${TOTAL_VH}vh` }}
      />

      <ProgressBar />
      <DebugHUD />
      <FlashOverlay />
      <Loader />
    </>
  )
}

export default App