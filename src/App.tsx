import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Loader from '@/components/Loader/loader'
import ProgressBar from '@/components/HUD/ProgressBar'
import DebugHUD from '@/components/HUD/DebugHUD'
import FlashOverlay from '@/components/HUD/FlashOverlay'
import SubtitleDisplay from '@/components/HUD/SubtitleDisplay'
import EndingFinale from '@/components/HUD/EndingFinale'
import PointerTracker from '@/components/Cursor/PointerTracker'
import PostFX from '@/components/PostFX/PostFX'
import SceneErrorBoundary from '@/components/ErrorBoundary/SceneErrorBoundary'
import IntroScene from '@/scenes/Intro/IntroScene'
import EarthScene from '@/scenes/Earth/EarthScene'
import SpaceScene from '@/scenes/Space/SpaceScene'
import PlanetOneScene from '@/scenes/PlanetOne/PlanetOneScene'
import PlanetTwoScene from '@/scenes/PlanetTwo/PlanetTwoScene'
import EndingScene from '@/scenes/Ending/EndingScene'
import { useScrollSync } from '@/hooks/useScrollSync'
import { TOTAL_VH } from '@/data/timeline'
import GlobalExposure from '@/scenes/GlobalExposure'

function App() {
  const scrollRef = useRef<HTMLDivElement>(null)
  useScrollSync(scrollRef)

  return (
    <>
      <div className="fixed inset-0 z-0">
        <SceneErrorBoundary>
          <Canvas
            camera={{ position: [0, 1.6, 14], fov: 56, near: 0.1, far: 400 }}
            gl={{ antialias: false }}
          >
            <color attach="background" args={['#050810']} />
            <fogExp2 attach="fog" args={['#050810', 0.02]} />
            <Suspense fallback={null}>
              <PointerTracker />
              <IntroScene />
              <EarthScene />
              <SpaceScene />
              <PlanetOneScene />
              <PlanetTwoScene />
              <EndingScene />
              <PostFX />
              <GlobalExposure />
            </Suspense>
          </Canvas>
        </SceneErrorBoundary>
      </div>

      <div
        className="relative z-10 pointer-events-none"
        ref={scrollRef}
        style={{ height: `${TOTAL_VH}vh` }}
      />

      <ProgressBar />
      <DebugHUD />
      <SubtitleDisplay />
      <EndingFinale />
      <FlashOverlay />
      <Loader />
    </>
  )
}

export default App