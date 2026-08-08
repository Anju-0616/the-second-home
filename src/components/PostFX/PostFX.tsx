import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration, DepthOfField } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

function PostFX() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={0.55}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.25}
        mipmapBlur
        radius={0.55}
      />
      <DepthOfField
        focusDistance={0.015}
        focalLength={0.04}
        bokehScale={2.5}
        height={480}
      />
      <ChromaticAberration
        offset={[0.0005, 0.0005]}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.28} darkness={0.85} />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.02} />
    </EffectComposer>
  )
}

export default PostFX