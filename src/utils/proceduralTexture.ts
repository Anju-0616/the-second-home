import * as THREE from 'three'

let cached: THREE.Texture | null = null

/** Generates a small tileable grayscale noise texture at runtime — used as a
 * roughness map to break up flat single-value PBR surfaces. Cached so every
 * caller shares one GPU texture instead of generating duplicates. */
export function getProceduralRoughnessMap(): THREE.Texture {
  if (cached) return cached

  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const imageData = ctx.createImageData(size, size)

  for (let i = 0; i < size * size; i++) {
    const v = 140 + Math.random() * 90
    imageData.data[i * 4] = v
    imageData.data[i * 4 + 1] = v
    imageData.data[i * 4 + 2] = v
    imageData.data[i * 4 + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  cached = texture
  return texture
}