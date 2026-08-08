import type { IslandConfig } from '@/components/FloatingIsland/FloatingIsland'

export const ISLANDS: IslandConfig[] = [
  {
    position: [2, 0, -6],
    radius: 3,
    rockColor: '#2a2440',
    vegetationColor: '#4ade80',
    seed: 5,
    bobSpeed: 0.28,
  },
  {
    position: [-3.5, 1.5, -22],
    radius: 4.2,
    rockColor: '#241f38',
    vegetationColor: '#2dd4bf',
    seed: 19,
    hasCivilization: true,
    civColor: '#a855f7',
    bobSpeed: 0.22,
  },
  {
    position: [3, -1, -40],
    radius: 3.6,
    rockColor: '#2a1f38',
    vegetationColor: '#ec4899',
    seed: 31,
    hasCivilization: true,
    civColor: '#ec4899',
    bobSpeed: 0.3,
  },
  {
    position: [0, 0.5, -60],
    radius: 5,
    rockColor: '#1f2438',
    vegetationColor: '#e8b64c',
    seed: 47,
    hasCivilization: true,
    civColor: '#e8b64c',
    bobSpeed: 0.18,
  },
]