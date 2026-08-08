/** Cheap deterministic pseudo-noise — not physically accurate, just visually
 * varied terrain per seed without needing a real noise library or textures. */
export function fakeNoise3(x: number, y: number, z: number, seed: number) {
  return (
    Math.sin(x * 1.3 + seed) * Math.cos(y * 1.7 + seed * 1.3) * 0.5 +
    Math.sin(y * 2.1 + seed * 0.7) * Math.cos(z * 1.9 + seed) * 0.3 +
    Math.sin(z * 1.1 + x * 0.6 + seed * 2.2) * 0.2
  )
}