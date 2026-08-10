import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import type { ThreeElement } from '@react-three/fiber'
import * as THREE from 'three'
import { snoiseGLSL } from './noise'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;

  ${snoiseGLSL}

  void main() {
    float horizFalloff = 1.0 - smoothstep(0.0, 0.5, abs(vUv.x - 0.5) * 2.0);
    float vertFalloff = smoothstep(0.0, 0.18, vUv.y) * (1.0 - smoothstep(0.82, 1.0, vUv.y));
    float flicker = 0.85 + 0.15 * snoise(vec3(vUv * 2.0, uTime * 0.6));
    float alpha = horizFalloff * vertFalloff * flicker * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`

const LightBeamMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#bfe8ff'),
    uOpacity: 0,
  },
  vertexShader,
  fragmentShader,
)

extend({ LightBeamMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    lightBeamMaterial: ThreeElement<typeof LightBeamMaterial>
  }
}

export default LightBeamMaterial
export type LightBeamMaterialInstance = InstanceType<typeof LightBeamMaterial>