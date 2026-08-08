# The Second Home — Build Progress

Cinematic scroll-driven 3D storytelling site. React + Vite + TypeScript + React Three Fiber + GSAP ScrollTrigger + Tailwind.

## Architecture

### Core principle: non-reactive state for 60fps loops

Scroll position and pointer position are read up to 60 times/sec inside `useFrame`.
Routing that through React state would cause a full re-render on every frame, so both
live in plain mutable singleton objects instead:

- `src/utils/scrollStore.ts` — global scroll progress (0-1), active phase index, local
  progress within that phase. Written once per scroll tick by `useScrollSync`. Read
  directly by any 3D component inside `useFrame` — no subscription, no re-render.
- `src/utils/pointerStore.ts` — smoothed pointer x/y and a raycasted world-space point
  ~7 units ahead of the camera. Written once per frame by `PointerTracker`. Read the
  same way as `scrollStore`.

A separate reactive hook, `useActivePhase` (`src/hooks/useActivePhase.ts`), polls
`scrollStore` via `requestAnimationFrame` but only calls `setState` when the active
phase index *changes* — so 2D UI (subtitles, HUD) re-renders a handful of times per
scroll-through, not 60 times/sec.

### Timeline system

`src/data/timeline.ts` is the single source of truth for story structure. Each phase
declares a relative `weightVh` (scroll distance) and an optional `flash` config
(color + progress threshold for an end-of-phase flash transition). `getPhaseRanges()`
converts weights into `[start, end]` slices of global 0-1 progress once, at module
load — every consumer (scroll sync, scenes, HUD) reads from the same computed ranges.

To adjust how much scroll distance a phase gets, change its `weightVh` — nothing else
needs to change.

### "Phase owns its camera" pattern

Every phase's root scene component (`IntroScene`, `EarthScene`, ...) has a `useFrame`
that starts with:

```ts
if (scrollStore.activeIndex !== PHASE_INDEX) return
```

Only the currently active phase moves the camera each frame. This means phases don't
need to coordinate with each other — a new phase just takes over automatically once
scroll reaches its range. Cheap idle animation (slow rotation, etc.) stays outside
this guard so scenes still feel alive when off-screen/inactive.

### Component structure

Each phase lives in `src/scenes/<PhaseName>/` as a folder of single-responsibility
components (environment, particles, main subject, effects) composed by one root
`<PhaseName>Scene.tsx` that also owns the camera logic for that phase. Never one
giant scene file.

### Explosions/big moments are pure functions of scroll progress

`EarthExplosion` computes particle radius/opacity directly from `localProgress` each
frame — it never accumulates state over time. GSAP's `scrub: true` lets users scroll
backward through any moment and watch it reverse smoothly; anything driven by a
`useEffect`/timer instead of scroll progress would break on scroll-reversal.

## Completed steps

### Step 1 — Scaffold
- Vite + React 19 + TypeScript 6, `pnpm` only
- Tailwind 3.4 (PostCSS-based, not the v4 plugin approach)
- Path alias `@/*` → `src/*` (both `vite.config.ts` and `tsconfig.app.json`)
- ESLint 9 flat config + Prettier, format-on-save
- Folder structure per spec: `components/`, `scenes/`, `hooks/`, `animations/`,
  `shaders/`, `utils/`, `data/`, `styles/`

### Step 2 — Scroll-sync system
- `src/data/timeline.ts` — phase definitions + range calculator
- `src/utils/scrollStore.ts` — non-reactive scroll state singleton
- `src/hooks/useScrollSync.ts` — GSAP ScrollTrigger wiring (one instance, whole site)
- `src/hooks/useActivePhase.ts` — reactive wrapper for 2D UI
- `src/components/HUD/ProgressBar.tsx`, `DebugHUD.tsx` (debug HUD to be removed once
  real subtitles exist)

### Step 3 — Phase 1: AI Laboratory
- `src/utils/pointerStore.ts` + `src/components/Cursor/PointerTracker.tsx`
- `src/scenes/Intro/`: `HologramCore`, `LabParticles`, `LabDoors`, `LabDrones`,
  `LabEnvironment`, composed in `IntroScene.tsx`
- Behavior: wireframe hologram tilts/pulses toward cursor, particles swirl away from
  cursor, drones orbit, room dims and doors slide open in the last ~25% of the phase
- **Bug fixed:** empty scroll-space spacer div had default `pointer-events: auto` and
  sat above the canvas in z-order, silently swallowing all pointer events before they
  reached the canvas. Fixed with `pointer-events-none` on that div in `App.tsx`.

### Step 4 — Phase 2: Earth
- `src/utils/math.ts` — shared `lerp`/`clamp01`/`smooth` (extracted once a second
  phase needed them)
- `src/components/HUD/FlashOverlay.tsx` — reusable end-of-phase flash, driven by each
  phase's `flash` config in `timeline.ts`
- `src/scenes/Earth/`: `EarthGlobe`, `EarthCracks`, `EarthExplosion`, `StarField`,
  composed in `EarthScene.tsx`
- Behavior: orbiting establishing shot with star parallax, cracks ignite sequentially
  past the phase midpoint, emissive color shifts blue→orange, clouds burn away,
  camera-shaking particle explosion in the final ~20%, warm flash out
- **Bug fixed:** camera path's `tz` value (distance from Earth's center) reached `4`,
  exactly Earth's surface radius, so the camera flew inside the sphere and the
  back-face geometry didn't render — cracks/explosion were computing correctly but
  invisible. Fixed by keeping the camera distance range outside the globe's radius
  (`8 → 15` instead of `12 → 4 → 9`).
- **Bug fixed:** page had no scrollbar / wouldn't scroll at all. Root cause:
  ambiguous scroll-root due to `height: 100%` on `body`/`#root`. Fixed in
  `src/styles/globals.css` — `html` now explicitly owns `overflow-y: scroll`,
  `body`/`#root` grow naturally to fit content instead of being capped at `100%`.

## Known temporary scaffolding (remove later)
- `DebugHUD.tsx` — plain-text phase name + progress number, to be replaced by real
  subtitle components once Phase 1/2 dialogue is designed
- No audio yet (Web Audio API integration is a later step per the original spec)
- No postprocessing yet (Bloom/DOF/Vignette are a later step)

## Next up
Step 5 — Phase 3: Journey Through Space (asteroid flight, nebula, GSAP-driven camera
path toward the first new-world reveal)