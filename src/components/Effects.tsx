import { EffectComposer, Bloom } from '@react-three/postprocessing'

export default function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.85}
        mipmapBlur
      />
    </EffectComposer>
  )
}
