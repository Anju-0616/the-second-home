import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import type { ThreeElement } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uDayMap;
  uniform sampler2D uNightMap;
  uniform sampler2D uCloudsMap;
  uniform vec3 uSunDirection;
  uniform vec3 uAtmosphereColor;
  uniform float uCloudOpacity;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    float sunFacing = dot(normal, normalize(uSunDirection));

    // soft terminator: smoothstep instead of a hard lit/unlit cutoff
    float dayMix = smoothstep(-0.15, 0.25, sunFacing);

    vec3 dayColor = texture2D(uDayMap, vUv).rgb;
    vec3 nightColor = texture2D(uNightMap, vUv).rgb * 1.4; // city lights, boosted slightly
    vec3 surface = mix(nightColor, dayColor, dayMix);

    // clouds only visible/lit on the day side, faint on the night side
    float cloudAlpha = texture2D(uCloudsMap, vUv).r * uCloudOpacity;
    vec3 cloudColor = vec3(1.0) * mix(0.15, 1.0, dayMix);
    surface = mix(surface, cloudColor, cloudAlpha * dayMix);

    // fresnel atmosphere rim — replaces the separate glow-ring mesh
    vec3 viewDir = normalize(vViewPosition);
    float rim = pow(1.0 - abs(dot(normal, viewDir)), 3.0);
    vec3 finalColor = surface + uAtmosphereColor * rim * (0.4 + dayMix * 0.4);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

const EarthMaterial = shaderMaterial(
  {
    uDayMap: new THREE.Texture(),
    uNightMap: new THREE.Texture(),
    uCloudsMap: new THREE.Texture(),
    uSunDirection: new THREE.Vector3(1, 0.3, 0.5),
    uAtmosphereColor: new THREE.Color('#4ce0e8'),
    uCloudOpacity: 0.6,
  },
  vertexShader,
  fragmentShader,
)

extend({ EarthMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    earthMaterial: ThreeElement<typeof EarthMaterial>
  }
}

export default EarthMaterial
export type EarthMaterialInstance = InstanceType<typeof EarthMaterial>