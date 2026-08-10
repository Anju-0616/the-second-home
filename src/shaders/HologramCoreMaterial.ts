import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import type { ThreeElement } from '@react-three/fiber'
import * as THREE from 'three'
import { snoiseGLSL } from './noise'

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform float uTime;

  ${snoiseGLSL}

  void main() {
    vec3 displaced = position + normal * (snoise(position * 2.5 + uTime * 0.3) * 0.025);
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewPosition = -mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uColorCore;
  uniform float uIntensity;

  ${snoiseGLSL}

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.4);
    float n = snoise(vNormal * 3.0 + uTime * 0.4) * 0.5 + 0.5;
    vec3 color = mix(uColorCore, uColor, clamp(fresnel + n * 0.2, 0.0, 1.0));
    float alpha = clamp(fresnel * 1.3 + n * 0.15, 0.0, 1.0) * uIntensity;
    gl_FragColor = vec4(color, alpha);
  }
`

const HologramCoreMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#4ce0e8'),
    uColorCore: new THREE.Color('#eafeff'),
    uIntensity: 1,
  },
  vertexShader,
  fragmentShader,
)

extend({ HologramCoreMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    hologramCoreMaterial: ThreeElement<typeof HologramCoreMaterial>
  }
}

export default HologramCoreMaterial
export type HologramCoreMaterialInstance = InstanceType<typeof HologramCoreMaterial>