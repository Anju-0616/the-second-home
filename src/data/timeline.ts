export interface Phase {
  id: string
  name: string
  /** Relative scroll weight — bigger number = more scroll distance for this phase */
  weightVh: number
  flash?: FlashConfig
}

export const PHASES: Phase[] = [
  { id: 'intro', name: 'AI Laboratory', weightVh: 600 },
  {
    id: 'earth',
    name: 'Earth',
    weightVh: 700,
    flash: { threshold: 0.97, color: '#fff2df' },
  },
  { id: 'space', name: 'Journey Through Space', weightVh: 750, flash: { threshold:0.96, color: '#e8f0ff'} },
  { id: 'planetOne', name: 'New Worlds', weightVh: 700, flash: { threshold: 0.96, color: '#f5e8ff' },},
  { id: 'planetTwo', name: 'The Second Home', weightVh: 650 },
  { id: 'ending', name: 'Ending', weightVh: 400 },
]

export const TOTAL_VH = PHASES.reduce((sum, p) => sum + p.weightVh, 0)

export interface PhaseRange extends Phase {
  start: number // 0-1, global scroll progress
  end: number
  index: number
}

/** Precomputed once — converts each phase's weight into a [start, end] slice of 0-1 */
export function getPhaseRanges(): PhaseRange[] {
  let acc = 0
  return PHASES.map((phase, index) => {
    const start = acc / TOTAL_VH
    acc += phase.weightVh
    const end = acc / TOTAL_VH
    return { ...phase, start, end, index }
  })
}
export interface FlashConfig {
  /** localProgress threshold within the phase where the flash starts */
  threshold: number
  color: string
}
