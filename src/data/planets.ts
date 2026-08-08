import type { PlanetConfig } from '@/components/Planet/Planet'

export const NEW_WORLDS: PlanetConfig[] = [
  {
    name: 'Crimson Reef',
    position: [3, 0, 0],
    radius: 3.2,
    color: '#8c2f1a',
    emissive: '#ff5522',
    atmosphereColor: '#ff8855',
    lightColor: '#ff6644',
    seed: 11,
    rotationSpeed: 0.03,
  },
  {
    name: 'Verdant Drift',
    position: [-4, 1, -28],
    radius: 4.5,
    color: '#1a5c3a',
    emissive: '#2dd4bf',
    atmosphereColor: '#4ade80',
    lightColor: '#4ade80',
    seed: 37,
    rotationSpeed: 0.015,
  },
  {
    name: 'Amethyst Veil',
    position: [2, -1, -55],
    radius: 3.8,
    color: '#3a1a5c',
    emissive: '#a855f7',
    atmosphereColor: '#c084fc',
    lightColor: '#a855f7',
    seed: 63,
    rotationSpeed: 0.02,
    hasRing: true,
    ringColor: '#e9d5ff',
  },
]