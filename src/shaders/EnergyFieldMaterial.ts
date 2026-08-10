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
    vec2 centered = vUv - 0.5;
    float r = length(centered) * 2.0;
    float band = smoothstep(0.25, 0.55, r) * (1.0 - smoothstep(0.55, 0.85, r));
    float flicker = 0.8 + 0.2 * snoise(vec3(centered * 4.0, uTime * 0.5));
    float alpha = band * flicker * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`

const EnergyFieldMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#4ce0e8'),
    uOpacity: 0.4,
  },
  vertexShader,
  fragmentShader,
)

extend({ EnergyFieldMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    energyFieldMaterial: ThreeElement<typeof EnergyFieldMaterial>
  }
}

export default EnergyFieldMaterial
export type EnergyFieldMaterialInstance = InstanceType<typeof EnergyFieldMaterial>