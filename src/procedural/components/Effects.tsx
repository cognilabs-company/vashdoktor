import { EffectComposer, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';

interface Props {
  /** MSAA only on capable viewports. */
  full: boolean;
}

/**
 * Just AgX tone mapping (required — the custom materials output linear HDR).
 * Bloom / vignette / grain were dropped: each is a full-screen pass and the
 * heavy one (bloom, with mipmap blur) was the biggest GPU cost / context-loss
 * risk. AgX alone keeps the premium grade cheaply.
 */
export function Effects({ full }: Props) {
  return (
    <EffectComposer multisampling={full ? 2 : 0} enableNormalPass={false}>
      <ToneMapping mode={ToneMappingMode.AGX} />
    </EffectComposer>
  );
}
