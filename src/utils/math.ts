export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function clamp01(v: number) {
  return Math.min(1, Math.max(0, v))
}

export function smooth(t: number) {
  t = clamp01(t)
  return t * t * (3 - 2 * t)
}
